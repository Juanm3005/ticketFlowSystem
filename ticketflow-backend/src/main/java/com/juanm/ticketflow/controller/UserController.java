package com.juanm.ticketflow.controller;

import com.juanm.ticketflow.model.Ticket;
import com.juanm.ticketflow.model.TicketState;
import com.juanm.ticketflow.model.User;
import com.juanm.ticketflow.model.UserRole;
import com.juanm.ticketflow.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    @PatchMapping("/{id}/role")
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