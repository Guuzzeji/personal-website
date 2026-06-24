package main

import (
	"log"
	"net"
	"net/http"
	"strings"
	"time"
)

// getRealIP extracts the actual client IP from the request headers
func getRealIP(r *http.Request) string {
	// 1. Try the X-Forwarded-For header
	xff := r.Header.Get("X-Forwarded-For")
	if xff != "" {
		// X-Forwarded-For can be a comma-separated list of IPs.
		// The first IP is the original client.
		ips := strings.Split(xff, ",")
		return strings.TrimSpace(ips[0])
	}

	// 2. Try the X-Real-IP header
	xri := r.Header.Get("X-Real-IP")
	if xri != "" {
		return strings.TrimSpace(xri)
	}

	// 3. Fallback to the default RemoteAddr
	// RemoteAddr usually includes the port (e.g., 192.168.1.5:49152). We just want the IP.
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		// If it fails to split (e.g., no port is present), just return the raw string
		return r.RemoteAddr
	}

	return ip
}

// loggingMiddleware wraps an http.Handler to log request details
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Serve the request by calling the original handler
		next.ServeHTTP(w, r)

		// Grab the real IP using our helper function
		realIP := getRealIP(r)

		// Log the IP address, HTTP method, requested path, and duration
		log.Printf("IP: %s | Method: %s | Asset: %s | Duration: %s",
			realIP,
			r.Method,
			r.URL.Path,
			time.Since(start),
		)
	})
}

func main() {
	fs := http.FileServer(http.Dir("./dist"))

	// Wrap your FileServer with the logging middleware
	http.Handle("/", loggingMiddleware(fs))

	log.Print("Listening on :3000...")
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Fatal(err)
	}
}