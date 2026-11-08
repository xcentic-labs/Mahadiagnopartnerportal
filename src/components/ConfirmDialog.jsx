import Modal from './Modal'

const ConfirmDialog = ({ open, title, message, confirmLabel = 'Confirm', danger, loading, onCancel, onConfirm }) => (
  <Modal open={open} title={title} onClose={onCancel} size="sm">
    <p className="text-gray-600">{message}</p>
    <div className="flex gap-3 mt-6">
      <button className="btn-outline flex-1" onClick={onCancel} disabled={loading}>Cancel</button>
      <button
        className={`flex-1 ${danger ? 'btn-primary !bg-red-500 hover:!bg-red-600' : 'btn-primary'}`}
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? 'Please wait...' : confirmLabel}
      </button>
    </div>
  </Modal>
)

export default ConfirmDialog
