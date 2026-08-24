package com.juanm.ticketflow.config;

import com.juanm.ticketflow.service.AuditContextService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class ClientIdentifierFilter extends OncePerRequestFilter {

    @Autowired
    private ObjectProvider<AuditContextService> auditContextServiceProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            AuditContextService auditContextService = auditContextServiceProvider.getObject();
            auditContextService.setClientIdentifier(auth.getName());
        }

        chain.doFilter(request, response);
    }
}