package email

import (
	"fmt"
	"strconv"

	"gopkg.in/gomail.v2"
)

type Service struct {
	host     string
	port     int
	user     string
	password string
	notifyTo string
}

func New(host, port, user, password, notifyTo string) *Service {
	p, _ := strconv.Atoi(port)
	return &Service{
		host:     host,
		port:     p,
		user:     user,
		password: password,
		notifyTo: notifyTo,
	}
}

func (s *Service) SendContactNotification(name, email, phone, message string) error {
	if s.notifyTo == "" || s.user == "" {
		// Email not configured — skip silently (don't fail the form submission)
		return nil
	}

	m := gomail.NewMessage()
	m.SetHeader("From", s.user)
	m.SetHeader("To", s.notifyTo)
	m.SetHeader("Subject", fmt.Sprintf("New Contact Form Submission from %s", name))
	m.SetBody("text/html", fmt.Sprintf(`
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> %s</p>
<p><strong>Email:</strong> %s</p>
<p><strong>Phone:</strong> %s</p>
<p><strong>Message:</strong></p>
<p>%s</p>
`, name, email, phone, message))

	d := gomail.NewDialer(s.host, s.port, s.user, s.password)
	return d.DialAndSend(m)
}

func (s *Service) SendQuoteNotification(names, email, phone, eventType, eventDate, budget, message string) error {
	if s.notifyTo == "" || s.user == "" {
		return nil
	}

	m := gomail.NewMessage()
	m.SetHeader("From", s.user)
	m.SetHeader("To", s.notifyTo)
	m.SetHeader("Subject", fmt.Sprintf("New Quote Request from %s", names))
	m.SetBody("text/html", fmt.Sprintf(`
<h2>New Quote Request</h2>
<p><strong>Names:</strong> %s</p>
<p><strong>Email:</strong> %s</p>
<p><strong>Phone:</strong> %s</p>
<p><strong>Event Type:</strong> %s</p>
<p><strong>Event Date:</strong> %s</p>
<p><strong>Budget:</strong> %s</p>
<p><strong>Message:</strong></p>
<p>%s</p>
`, names, email, phone, eventType, eventDate, budget, message))

	d := gomail.NewDialer(s.host, s.port, s.user, s.password)
	return d.DialAndSend(m)
}
