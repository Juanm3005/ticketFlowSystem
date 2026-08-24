package com.juanm.ticketflow.service;

import com.juanm.ticketflow.model.Ticket;
import com.juanm.ticketflow.model.TicketState;
import com.juanm.ticketflow.model.User;
import com.juanm.ticketflow.repository.TicketRepository;
import com.juanm.ticketflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;


    public Ticket createTicket(Ticket ticket) {
        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        User creador = userRepository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        ticket.setState(TicketState.OPEN);
        ticket.setCreatedBy(creador);
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found");
        }
        ticketRepository.deleteById(id);
    }

    public List<Ticket> listTickets(TicketState stateFilter) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        boolean isEmployee = auth.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_TECHNICIAN"));

        if (isEmployee) {
            if (stateFilter != null) {
                return ticketRepository.findByCreatedBy_EmailAndState(email, stateFilter);
            }
            return ticketRepository.findByCreatedBy_Email(email);
        }

        if (stateFilter != null) {
            return ticketRepository.findByState(stateFilter);
        }
        return ticketRepository.findAll();
    }

    public Ticket changeState(Long id, TicketState newState) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (newState == ticket.getState()) {
            throw new RuntimeException("Ticket is already in the state: " + newState);
        }

        var auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            boolean isClaimingUnassignedTicket = newState == TicketState.IN_PROGRESS && ticket.getAssignedTo() == null;

            if (!isClaimingUnassignedTicket) {
                if (ticket.getAssignedTo() == null || !ticket.getAssignedTo().getEmail().equals(email)) {
                    throw new RuntimeException("You are not assigned to this ticket");
                }
            }
        }

        if (newState == TicketState.IN_PROGRESS) {
            if (ticket.getAssignedTo() != null && !ticket.getAssignedTo().getEmail().equals(email)) {
                throw new RuntimeException("this ticket is already assigned to another technician");
            }
            User technician = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
            ticket.setAssignedTo(technician);
        }

        ticket.setState(newState);
        return ticketRepository.save(ticket);
    }
}
