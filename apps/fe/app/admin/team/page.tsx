"use client"
import { motion } from "framer-motion"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import AdminLayout from "@/components/admin-layout"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "Owner" | "Admin" | "Finance" | "Contributor"
  joinDate: string
}

const members: TeamMember[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Owner", joinDate: "2024-01-15" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Admin", joinDate: "2024-02-20" },
  { id: "3", name: "Carol White", email: "carol@example.com", role: "Finance", joinDate: "2024-03-10" },
  { id: "4", name: "David Brown", email: "david@example.com", role: "Contributor", joinDate: "2024-04-05" },
]

const roleColors = {
  Owner: "bg-purple-500/20 text-purple-300",
  Admin: "bg-cyan-500/20 text-cyan-300",
  Finance: "bg-green-500/20 text-green-300",
  Contributor: "bg-blue-500/20 text-blue-300",
}

export default function TeamPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Team & Roles</h1>
            <p className="text-gray-400">Manage team members and permissions</p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold gap-2">
            <Plus size={20} />
            Invite Member
          </Button>
        </motion.div>

        {/* Team Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-cyan-300/20 rounded-xl overflow-hidden backdrop-blur-md"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-300/10">
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Role</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Join Date</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-cyan-300/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-white font-medium">{member.name}</td>
                  <td className="px-6 py-4 text-gray-300">{member.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleColors[member.role]}`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{member.joinDate}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Edit2 size={16} className="text-cyan-300" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Trash2 size={16} className="text-red-300" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Pending Invites */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-cyan-300/20 rounded-lg p-6 backdrop-blur-md"
        >
          <h3 className="text-lg font-bold text-white mb-4">Pending Invitations</h3>
          <div className="space-y-3">
            {[
              { email: "newmember@example.com", role: "Finance", sent: "2 days ago" },
              { email: "contributor@example.com", role: "Contributor", sent: "5 days ago" },
            ].map((invite, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{invite.email}</p>
                  <p className="text-gray-400 text-sm">
                    Role: {invite.role} • Sent {invite.sent}
                  </p>
                </div>
                <button className="text-red-300 hover:text-red-200 text-sm font-semibold">Cancel</button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
