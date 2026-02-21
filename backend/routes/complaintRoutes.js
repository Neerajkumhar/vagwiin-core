const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const Warranty = require('../models/Warranty');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Book a diagnosis (Create a complaint)
// @route   POST /api/complaints
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { serialNumber, issueDescription, diagnosisDate } = req.body;

        // Verify if the serial number is under warranty
        const warranty = await Warranty.findOne({
            serialNumber,
            status: 'Active',
            endDate: { $gte: new Date() } // Ensure warranty is still valid
        });

        if (!warranty) {
            return res.status(400).json({
                message: 'Invalid serial number or warranty has expired.'
            });
        }

        // Optional: Check if the product belongs to the user if needed, 
        // though typically anyone with a valid warranty serial can book.
        // if (warranty.user.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({ message: 'This warranty does not belong to you.' });
        // }

        const complaint = new Complaint({
            user: req.user._id,
            warranty: warranty._id,
            serialNumber,
            issueDescription,
            diagnosisDate
        });

        const createdComplaint = await complaint.save();
        res.status(201).json(createdComplaint);
    } catch (error) {
        console.error('Error booking diagnosis:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get logged in user's complaints
// @route   GET /api/complaints/mycomplaints
// @access  Private
// @desc    Get logged in user's complaints
// @route   GET /api/complaints/mycomplaints
// @access  Private
router.get('/mycomplaints', protect, async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user._id })
            .populate('warranty')
            .populate('assignedTechnician', 'fullName email phone')
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get complaints assigned to a technician
// @route   GET /api/complaints/assigned
// @access  Private (Technician)
router.get('/assigned', protect, async (req, res) => {
    try {
        // Only allow technicians and admins
        if (req.user.role !== 'technician' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const complaints = await Complaint.find({ assignedTechnician: req.user._id })
            .populate('user', 'fullName email phone address')
            .populate('warranty')
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('user', 'fullName email phone address')
            .populate('warranty')
            .populate('assignedTechnician', 'fullName email phone');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Only allow the user who created it, the assigned technician, or an admin
        if (
            complaint.user._id.toString() !== req.user._id.toString() &&
            complaint.assignedTechnician?._id.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all complaints (Admin only)
// @route   GET /api/complaints
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const complaints = await Complaint.find({})
            .populate('user', 'fullName email')
            .populate('warranty')
            .populate('assignedTechnician', 'fullName email phone')
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private (Admin or Assigned Technician)
router.put('/:id', protect, async (req, res) => {
    try {
        const { status, adminNotes, assignedTechnician } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Authorization: Admin or Assigned Technician
        const isAssignedTech = complaint.assignedTechnician && complaint.assignedTechnician.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && !isAssignedTech) {
            return res.status(403).json({ message: 'Not authorized to update this complaint' });
        }

        // Apply updates
        if (status) complaint.status = status;
        if (adminNotes) complaint.adminNotes = adminNotes;
        if (assignedTechnician && isAdmin) {
            complaint.assignedTechnician = assignedTechnician;
        }

        complaint.updatedAt = Date.now();

        const updatedComplaint = await complaint.save();
        const populatedComplaint = await Complaint.findById(updatedComplaint._id)
            .populate('user', 'fullName email phone address')
            .populate('warranty')
            .populate('assignedTechnician', 'fullName email phone');

        // Notify Customer about Main Ticket Status Change
        if (status && ['In Progress', 'Resolved', 'Cancelled'].includes(status)) {
            console.log(`[Ticket Status] Triggering notification for ticket ${populatedComplaint._id}, status: ${status}`);
            try {
                const customer = await User.findById(populatedComplaint.user._id || populatedComplaint.user);
                if (customer) {
                    const notification = {
                        title: `Ticket Updates: ${status}`,
                        message: `Your ticket #${populatedComplaint._id.slice(-8).toUpperCase()} for ${populatedComplaint.serialNumber} is now ${status}.`,
                        type: status === 'Resolved' ? 'success' : status === 'Cancelled' ? 'error' : 'info'
                    };
                    customer.notifications.unshift(notification);
                    await customer.save();
                    console.log(`[Ticket Status] Notification saved for ${customer.email}`);

                    // Send Email
                    await sendEmail({
                        email: customer.email,
                        subject: `Ticket Update: #${populatedComplaint._id.slice(-8).toUpperCase()} is now ${status}`,
                        message: `Your ticket status has been updated to ${status}.`,
                        html: `<div style="font-family: sans-serif; padding: 20px;"><h2>Ticket Update</h2><p>Your ticket <b>#${populatedComplaint._id.slice(-8).toUpperCase()}</b> status has been changed to <b style="color: #2563eb;">${status}</b>.</p></div>`
                    });
                }
            } catch (notifyError) {
                console.error('[Ticket Status] Failed to notify customer:', notifyError);
            }
        }

        res.json(populatedComplaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Request spare parts for a complaint
// @route   POST /api/complaints/:id/spares
// @access  Private (Assigned Technician)
router.post('/:id/spares', protect, async (req, res) => {
    try {
        const { partName, quantity, spares } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Authorization: Only the assigned technician or admin can request spares
        if (
            complaint.assignedTechnician?.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized to request spares for this complaint' });
        }

        if (spares && Array.isArray(spares)) {
            spares.forEach(spare => {
                if (spare.partName) {
                    complaint.requestedSpares.push({
                        partName: spare.partName,
                        quantity: spare.quantity || 1,
                        status: 'Pending',
                        requestDate: Date.now()
                    });
                }
            });
        } else if (partName) {
            complaint.requestedSpares.push({
                partName,
                quantity: quantity || 1,
                status: 'Pending',
                requestDate: Date.now()
            });
        } else {
            return res.status(400).json({ message: 'No spare parts provided' });
        }

        await complaint.save();
        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update spare part request status
// @route   PUT /api/complaints/:id/spares/:spareId
// @access  Private (Admin)
router.put('/:id/spares/:spareId', protect, admin, async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const spare = complaint.requestedSpares.id(req.params.spareId);
        if (!spare) {
            return res.status(404).json({ message: 'Spare part request not found' });
        }

        if (status) spare.status = status;
        if (adminNotes) spare.adminNotes = adminNotes;

        await complaint.save();

        // Notify Customer
        const notifyStatuses = ['Approved', 'Ordered', 'Ready', 'Rejected'];
        if (status && notifyStatuses.includes(status)) {
            console.log(`[Notification] Triggering for customer on ticket ${complaint._id}, status: ${status}`);
            try {
                const customer = await User.findById(complaint.user);
                if (customer) {
                    // 1. Add In-App Notification
                    const notification = {
                        title: status === 'Rejected' ? `Spare Denied: ${spare.partName}` : `Spare Update: ${spare.partName}`,
                        message: `Your requested spare part "${spare.partName}" is now ${status}. ${adminNotes || ''}`,
                        type: status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'info'
                    };
                    customer.notifications.unshift(notification);
                    await customer.save();
                    console.log(`[Notification] In-app notification saved for ${customer.email}`);

                    // 2. Send Email
                    const emailContent = `
                        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                            <h2 style="color: #2563eb;">Spare Part Update</h2>
                            <p>Hello ${customer.fullName},</p>
                            <p>The status of your requested spare part for <b>Ticket #${complaint._id.slice(-8).toUpperCase()}</b> has been updated.</p>
                            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <p style="margin: 0 0 10px 0;"><b>Part Name:</b> ${spare.partName}</p>
                                <p style="margin: 0;"><b>New Status:</b> <span style="color: ${status === 'Rejected' ? '#dc2626' : '#2563eb'}; font-weight: bold;">${status}</span></p>
                            </div>
                            ${adminNotes ? `<p><b>Admin Notes:</b> ${adminNotes}</p>` : ''}
                            <p style="color: #64748b; font-size: 12px; margin-top: 30px;">This is an automated message from Vagwiin Core Support.</p>
                        </div>
                    `;

                    await sendEmail({
                        email: customer.email,
                        subject: `Spare Part Request: ${status} - Bagwiin Core`,
                        message: `Your spare part "${spare.partName}" is now ${status}. Ticket: #${complaint._id.slice(-8).toUpperCase()}`,
                        html: emailContent
                    });
                } else {
                    console.log(`[Notification] Customer not found for complaint ${complaint._id}`);
                }
            } catch (notifyError) {
                console.error('[Notification] Error sending notification:', notifyError);
            }
        }

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
