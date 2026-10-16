import { Table, Th, Tr, Td, EmptyRow } from "../ui/Table";
import ActionSelect from "../ui/ActionSelect";
import Button from "../ui/Button";
import { ASSIGNABLE_ROLES, toOptions } from "../../constants/options";

const ACTION_OPTIONS = [
    { value: "delete", label: "Delete" },
    { value: "changeRole", label: "Change role" },
];

const ROLE_OPTIONS = toOptions(ASSIGNABLE_ROLES);

function UserTable({ users, rowActions, onRowActionChange, onExecute }) {
    return (
        <Table>
            <thead>
                <tr>
                    <Th>ID</Th>
                    <Th>Username</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Actions</Th>
                </tr>
            </thead>
            <tbody>
                {users.length === 0 ? (
                    <EmptyRow colSpan="5" message="No users to display" />
                ) : (
                    users.map((user) => (
                        <Tr key={user.id}>
                            <Td>{user.id}</Td>
                            <Td>{user.username}</Td>
                            <Td>{user.email}</Td>
                            <Td>{user.role}</Td>

                            <Td className="flex items-center gap-2">
                                <ActionSelect
                                    value={rowActions[user.id]?.action || ""}
                                    onChange={(e) => onRowActionChange(user.id, "action", e.target.value)}
                                    placeholder="Select action"
                                    options={ACTION_OPTIONS}
                                />

                                {rowActions[user.id]?.action === "changeRole" && (
                                    <ActionSelect
                                        value={rowActions[user.id]?.newRole || ""}
                                        onChange={(e) => onRowActionChange(user.id, "newRole", e.target.value)}
                                        placeholder="Select role"
                                        options={ROLE_OPTIONS}
                                    />
                                )}

                                <Button variant="execute" onClick={() => onExecute(user)}>
                                    Execute
                                </Button>
                            </Td>
                        </Tr>
                    ))
                )}
            </tbody>
        </Table>
    );
}

export default UserTable;
