"use client"
import React, { useState } from "react"

export default function FeedbackForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<null | "idle" | "sending" | "sent" | "error">(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("sending")
    try {
      // replace with actual submit (fetch / supabase)
      await new Promise((r) => setTimeout(r, 700))
      setStatus("sent")
      setName("")
      setEmail("")
      setMessage("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <label className="block mb-2">
        <span className="text-sm font-medium">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
          required
        />
      </label>

      <label className="block mb-2">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
          required
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm font-medium">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
          rows={5}
          required
        />
      </label>

      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending..." : "Send Feedback"}
      </button>

      {status === "sent" && <p className="mt-3 text-green-600">Thanks — your feedback was sent.</p>}
      {status === "error" && <p className="mt-3 text-red-600">Something went wrong. Try again.</p>}
    </form>
  )
}