const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    warranty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warranty',
        required: true
    },
    serialNumber: {
        type: String,
        required: true
    },
    issueDescription: {
        type: String,
        required: true
    },
    assignedTechnician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
        enum: ['Pending', 'In Progress', 'Resolved', 'Cancelled']
    },
    diagnosisDate: {
        type: Date,
        required: true
    },
    adminNotes: {
        type: String,
        default: ''
    },
    requestedSpares: [
        {
            partName: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 },
            status: {
                type: String,
                required: true,
                default: 'Pending',
                enum: ['Pending', 'Approved', 'Rejected', 'Ordered', 'Ready']
            },
            requestDate: { type: Date, default: Date.now },
            adminNotes: { type: String, default: '' }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
