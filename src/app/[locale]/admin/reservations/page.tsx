
import ReservationsDashboard from "@/components/admin/reservations";

export default function ReservationPage({ params }: { params: { locale: string } }) {
  return (
   <div>
    <ReservationsDashboard />
   </div>
  );
}