import { Settings, MapPin, Heart, Bookmark, Users, ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile, useUserStats } from "@/hooks/useGems";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: profile } = useUserProfile();
  const { data: stats } = useUserStats();

  if (!user) {
    return (
      <div className="min-h-screen pb-24">
        <header className="sticky top-0 z-40 glass-card px-4 py-3">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <h1 className="font-semibold">Profile</h1>
          </div>
        </header>
        <main className="mx-auto max-w-lg px-4 pt-16 text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">Log in to see your profile</p>
          <button onClick={() => navigate("/auth")} className="mt-4 gem-gradient rounded-full px-8 py-3 text-sm font-semibold text-primary-foreground">
            Log In / Sign Up
          </button>
        </main>
      </div>
    );
  }

  const displayName = profile?.display_name || user.email?.split("@")[0] || "Explorer";
  const initials = displayName.charAt(0).toUpperCase();

  const statItems = [
    { label: "Gems", value: stats?.gems ?? 0, icon: MapPin },
    { label: "Reviews", value: stats?.reviews ?? 0, icon: Heart },
    { label: "Saved", value: stats?.saves ?? 0, icon: Bookmark },
    { label: "Following", value: stats?.following ?? 0, icon: Users },
  ];

  const menuItems = [
    { label: "Edit Profile", icon: Settings },
    { label: "My Submissions", icon: MapPin },
    { label: "Notifications", icon: Heart },
    { label: "Settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
        <div className="animate-fade-in rounded-2xl bg-card p-6 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full gem-gradient text-3xl font-bold text-primary-foreground">
            {initials}
          </div>
          <h2 className="mt-3 text-lg font-bold text-card-foreground">{displayName}</h2>
          {profile?.username && <p className="text-sm text-muted-foreground">@{profile.username}</p>}
          {profile?.bio && <p className="mt-2 text-xs text-muted-foreground">{profile.bio}</p>}
          {profile?.country && (
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {profile.region ? `${profile.region}, ` : ""}{profile.country}
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {statItems.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-card p-3 text-center shadow-sm">
              <Icon className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1 text-lg font-bold text-card-foreground">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          {menuItems.map(({ label, icon: Icon }) => (
            <button key={label} className="flex w-full items-center gap-3 rounded-xl bg-card px-4 py-3.5 shadow-sm transition-all hover:shadow-md text-left">
              <Icon className="h-5 w-5 text-primary" />
              <span className="flex-1 text-sm font-medium text-card-foreground">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
          <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-xl bg-card px-4 py-3.5 shadow-sm text-left">
            <LogOut className="h-5 w-5 text-destructive" />
            <span className="flex-1 text-sm font-medium text-destructive">Log Out</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
