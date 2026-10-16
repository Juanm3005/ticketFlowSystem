import Modal, { ModalActions } from "../ui/Modal";
import FormField, { fieldClass } from "../ui/FormField";
import Button from "../ui/Button";

function CreateTicketModal({ title, description, onTitleChange, onDescriptionChange, onSubmit, onClose }) {
    return (
        <Modal
            title="Create Ticket"
            description="Create a new support ticket."
            maxWidth="max-w-[520px]"
            headerSize="sm"
            onClose={onClose}
        >
            <form className="p-6" onSubmit={onSubmit}>
                <FormField label="Title" className="mb-[18px]">
                    <input
                        type="text"
                        className={`${fieldClass} h-[42px]`}
                        placeholder="Enter ticket title"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        required
                    />
                </FormField>

                <FormField label="Description" className="mb-[18px]">
                    <textarea
                        className={`${fieldClass} min-h-[150px] py-[11px] resize-y leading-[1.5]`}
                        placeholder="Describe the problem or request..."
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        required
                    />
                </FormField>

                <ModalActions className="mt-6">
                    <Button type="button" variant="cancel" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button type="submit" variant="create">
                        Create Ticket
                    </Button>
                </ModalActions>
            </form>
        </Modal>
    );
}

export default CreateTicketModal;
