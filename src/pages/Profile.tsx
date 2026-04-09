import { Settings, MapPin, Heart, Bookmark, Users, ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Gems", value: "12", icon: MapPin },
    { label: "Likes", value: "284", icon: Heart },
    { label: "Saved", value: "45", icon: Bookmark },
    { label: "Following", value: "89", icon: Users },
  ];

  const menuItems = [
    { label: "Edit Profile", icon: Settings },
    { label: "My Submissions", icon: MapPin },
    { label: "Notifications", icon: Heart },
    { label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <h1 className="font-semibold">Profile</h1>
          <button className="rounded-full p-1.5 hover:bg-muted">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-6">
        {/* Profile Card */}
        <div className="animate-fade-in rounded-2xl bg-card p-6 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full gem-gradient text-3xl font-bold text-primary-foreground">
            A
          </div>
          <h2 className="mt-3 text-lg font-bold text-card-foreground">Alex Explorer</h2>
          <p className="text-sm text-muted-foreground">@alexexplorer</p>
          <p className="mt-2 text-xs text-muted-foreground">
            🌍 Finding beauty in hidden corners of the world
          </p>
          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            Lisbon, Portugal
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-card p-3 text-center shadow-sm">
              <Icon className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1 text-lg font-bold text-card-foreground">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="mt-6 space-y-2">
          {menuItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="flex w-full items-center gap-3 rounded-xl bg-card px-4 py-3.5 shadow-sm transition-all hover:shadow-md text-left"
            >
              <Icon className="h-5 w-5 text-primary" />
              <span className="flex-1 text-sm font-medium text-card-foreground">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
          <button className="flex w-full items-center gap-3 rounded-xl bg-card px-4 py-3.5 shadow-sm text-left">
            <LogOut className="h-5 w-5 text-destructive" />
            <span className="flex-1 text-sm font-medium text-destructive">Log Out</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
