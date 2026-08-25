package com.juanm.ticketflow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ticket-audit")
public class TicketAuditController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> getRecentActivity() {
        String sql = "SELECT * FROM ticket_audit ORDER BY changed_at DESC FETCH FIRST 10 ROWS ONLY";
        return jdbcTemplate.queryForList(sql);
    }
}