package com.juanm.ticketflow.dto;

import com.juanm.ticketflow.model.UserRole;
import lombok.Data;

@Data
public class CreateUserRequest {
    private String username;
    private String email;
    private String password;
    private UserRole role;
}