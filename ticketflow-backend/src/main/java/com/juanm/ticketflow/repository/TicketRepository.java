package com.juanm.ticketflow.repository;
import com.juanm.ticketflow.model.Ticket;
import com.juanm.ticketflow.model.TicketState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedBy_Email(String email);
    List<Ticket> findByCreatedBy_EmailAndState(String email, TicketState state);
    List<Ticket> findByState(TicketState state);
}