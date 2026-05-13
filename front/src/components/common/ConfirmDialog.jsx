import Modal from './Modal';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  confirmVariant = 'danger',
  onConfirm,
  onClose,
}) {
  const confirmClass =
    confirmVariant === 'primary'
      ? 'rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]'
      : 'rounded-md bg-[var(--color-danger)] px-4 py-2 text-sm font-semibold text-[var(--color-card)] hover:opacity-90';

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg)]"
          >
            Cancel
          </button>
          <button
            type="button"
            className={confirmClass}
            onClick={async () => {
              try {
                await onConfirm?.();
              } finally {
                onClose?.();
              }
            }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-[var(--color-text-muted)]">{message}</p>
    </Modal>
  );
}
