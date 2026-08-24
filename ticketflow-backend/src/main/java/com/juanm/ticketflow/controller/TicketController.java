package com.juanm.ticketflow.controller;

import com.juanm.ticketflow.model.Ticket;
import com.juanm.ticketflow.model.TicketState;
import com.juanm.ticketflow.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public Ticket create(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @GetMapping
    public List<Ticket> list(@RequestParam(required = false) TicketState state) {
        return ticketService.listTickets(state);
    }

    @PatchMapping("/{id}/state")
    @PreAuthorize("hasRole('TECHNICIAN') or hasRole('ADMIN')")
    public Ticket changeState(@PathVariable Long id, @RequestBody TicketState nuevoEstado) {
        return ticketService.changeState(id, nuevoEstado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        ticketService.deleteTicket(id);
    }
}