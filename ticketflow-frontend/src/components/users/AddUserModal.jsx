import Modal, { ModalActions } from "../ui/Modal";
import FormField, { fieldClass } from "../ui/FormField";
import Button from "../ui/Button";
import { ASSIGNABLE_ROLES } from "../../constants/options";

const inputClass = `${fieldClass} h-10`;

// `values`: { username, email, password, role } — `onChange(field, value)`
function AddUserModal({ values, onChange, onSubmit, onClose }) {
    return (
        <Modal
            title="Add User"
            description="Create a new user for the TicketFlow system."
            onClose={onClose}
        >
            <form className="pt-[22px] px-6 pb-6" onSubmit={onSubmit}>
                <FormField label="Username">
                    <input
                        type="text"
                        className={inputClass}
                        placeholder="Enter username"
                        value={values.username}
                        onChange={(e) => onChange("username", e.target.value)}
                        required
                    />
                </FormField>

                <FormField label="Email">
                    <input
                        type="email"
                        className={inputClass}
                        placeholder="Enter email"
                        value={values.email}
                        onChange={(e) => onChange("email", e.target.value)}
                        required
                    />
                </FormField>

                <FormField label="Password">
                    <input
                        type="password"
                        className={inputClass}
                        placeholder="Enter password"
                        value={values.password}
                        onChange={(e) => onChange("password", e.target.value)}
                        required
                    />
                </FormField>

                <FormField label="Role">
                    <select
                        className={inputClass}
                        value={values.role}
                        onChange={(e) => onChange("role", e.target.value)}
                    >
                        {ASSIGNABLE_ROLES.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </FormField>

                <ModalActions>
                    <Button type="button" variant="cancel" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button type="submit" variant="create">
                        Create User
                    </Button>
                </ModalActions>
            </form>
        </Modal>
    );
}

export default AddUserModal;
