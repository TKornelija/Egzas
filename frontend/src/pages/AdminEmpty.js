// import { getAdmin, adminLogout } from "../lib/adminAuth";
// import { useNavigate } from "react-router-dom";

// export default function AdminEmpty(){
//   const nav = useNavigate();
//   const a = getAdmin();
//   return (
//     <div style={{ padding: 24 }}>
//       <h2>Admin panel</h2>
//       <p>Welcome, {a?.email} ({a?.role}). Здесь будет админка.</p>
//       <button onClick={()=>{ adminLogout(); nav("/admin/login", { replace:true }); }}>
//         Logout admin
//       </button>
//     </div>
//   );
// }
