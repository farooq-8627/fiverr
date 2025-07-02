import AgentProfileForm from "./agent-profile-form";

export default function AgentProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Agent Profile
            </h1>
            <p className="mt-2 text-gray-600">
              Set up your professional profile to connect with clients
            </p>
          </div>
          <div className="px-6 py-8">
            <AgentProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
}
