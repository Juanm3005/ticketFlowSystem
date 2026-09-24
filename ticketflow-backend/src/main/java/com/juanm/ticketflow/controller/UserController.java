package com.juanm.ticketflow.controller;

import com.juanm.ticketflow.model.User;
import com.juanm.ticketflow.model.UserRole;
import com.juanm.ticketflow.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.juanm.ticketflow.dto.CreateUserRequest;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public User me() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.findByEmail(email);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PostMapping("/admin-create")
    @PreAuthorize("hasRole('ADMIN')")
    public User createUserByAdmin(@RequestBody CreateUserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        return userService.createUserByAdmin(user, request.getRole());
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    @PatchMapping("/{email}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public User changeRole(@PathVariable String email, @RequestBody UserRole newRole) {
        return userService.changeRole(email, newRole);
    }
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> list() {
        return userService.listUser();
    }
}