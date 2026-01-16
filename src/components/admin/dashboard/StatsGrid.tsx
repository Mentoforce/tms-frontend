import StatsCard from "./StatsCard";

export default function StatsGrid({ stats }: { stats: any }) {
  const cards = [
    { title: "Total Tickets", value: stats.totalTickets },
    { title: "Pending Tickets", value: stats.pendingTickets },
    { title: "Solved Tickets", value: stats.solvedTickets },
    // { title: "New Tickets Today", value: stats.newTicketsToday },

    { title: "Total Callback Requests", value: stats.totalCallbackRequests },
    {
      title: "Pending Callback Requests",
      value: stats.pendingCallbackRequests,
    },
    {
      title: "Solved Callback Requests",
      value: stats.completedCallbackRequests,
    },
    // {
    //   title: "New Callback Requests Today",
    //   value: stats.newCallbackRequestsToday,
    // },

    { title: "Total Bonus Claims", value: stats.totalBonusClaims },
    {
      title: "Pending Bonus Claims",
      value: stats.pendingBonusClaims,
    },
    {
      title: "Solved Bonus Claims",
      value: stats.resolvedBonusClaims,
    },
    // {
    //   title: "New Bonus Claims Today",
    //   value: stats.bonusClaimsToday,
    // },

    // { title: "Admins", value: stats.totalAdmins },
    { title: "Active Admins", value: stats.activeAdmins },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {cards.map((c) => (
        <StatsCard key={c.title} {...c} />
      ))}
    </div>
  );
}
