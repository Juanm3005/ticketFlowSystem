package com.juanm.ticketflow.service;

import com.juanm.ticketflow.model.Ticket;
import com.juanm.ticketflow.model.TicketState;
import com.juanm.ticketflow.model.UserRole;
import com.juanm.ticketflow.model.User;
import com.juanm.ticketflow.repository.UserRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Data
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(UserRole.EMPLOYEE); // siempre, sin importar qué mande el cliente
        return userRepository.save(user);
    }

    public User changeRole(String email, UserRole newRol) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole().equals(newRol)){
            throw new RuntimeException("User already has the role: " + newRol);
        }else if(user.getRole().equals(UserRole.ADMIN)){
            throw new RuntimeException("Cannot change role of an ADMIN user");
        }
        user.setRole(newRol);
        return userRepository.save(user);
    }

    public List<User> listUser() {
        return userRepository.findAll();
    }
}