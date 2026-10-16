import { useState } from "react";
import { Card, CardHeader } from "../ui/Card";
import Button from "../ui/Button";
import FilterBar from "../ui/FilterBar";
import { TableFooter } from "../ui/Table";
import AddUserModal from "./AddUserModal";
import UserTable from "./UserTable";
import { ALL_ROLES, toOptions } from "../../constants/options";

const ROLE_FILTER_OPTIONS = [{ value: "ALL", label: "All Roles" }, ...toOptions(ALL_ROLES)];

const EMPTY_USER = { username: "", email: "", password: "", role: "TECHNICIAN" };

function UsersSection({ users, onAddUser, rowActions, onRowActionChange, onExecute }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState(EMPTY_USER);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    const filteredUsers = users.filter(user => {
        const matchesUsername = user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        return matchesUsername && matchesRole;
    });

    function handleClearFilters() {
        setSearchTerm("");
        setRoleFilter("ALL");
    }

    function setNewUserField(field, value) {
        setNewUser(prev => ({ ...prev, [field]: value }));
    }

    async function handleAddUser(e) {
        e.preventDefault();
        const { username, email, password, role } = newUser;
        const created = await onAddUser(username, email, password, role);

        if (created) {
            setShowAddForm(false);
            setNewUser(EMPTY_USER);
        }
    }

    return (
        <section id="users">
            <Card>
                <CardHeader title="Users" description="Manage system users and their roles.">
                    <Button variant="primary" onClick={() => setShowAddForm(true)}>
                        + Add User
                    </Button>
                </CardHeader>

                {showAddForm && (
                    <AddUserModal
                        values={newUser}
                        onChange={setNewUserField}
                        onSubmit={handleAddUser}
                        onClose={() => setShowAddForm(false)}
                    />
                )}

                <FilterBar
                    searchPlaceholder="Search users by username"
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectValue={roleFilter}
                    onSelectChange={setRoleFilter}
                    options={ROLE_FILTER_OPTIONS}
                    onClear={handleClearFilters}
                />

                <UserTable
                    users={filteredUsers}
                    rowActions={rowActions}
                    onRowActionChange={onRowActionChange}
                    onExecute={onExecute}
                />

                <TableFooter />
            </Card>
        </section>
    );
}

export default UsersSection;
