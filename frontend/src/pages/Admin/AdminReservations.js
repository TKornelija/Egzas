// import { useEffect, useState } from "react";
// import axios from "../../lib/axios";

// export default function AdminReservations(){
//   const [summary, setSummary] = useState([]);
//   const [rows, setRows] = useState([]);
//   const [status, setStatus] = useState("");

//   async function loadSummary(){ 
//     const r = await axios.get("/admin/reservations/summary"); 
//     setSummary(r.data);
//   }
//   async function loadRows(st){ 
//     const r = await axios.get("/admin/reservations", { params: { status: st || undefined }});
//     setRows(r.data);
//   }

//   useEffect(()=>{ loadSummary(); loadRows(status); }, [status]);

//   return (
//     <div>
//       <h2 style={{ marginTop: 0 }}>Reservations</h2>

//       {/* Filters */}
//       <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
//         <label>Status:</label>
//         <select value={status} onChange={e=>setStatus(e.target.value)}>
//           <option value="">All</option>
//           <option value="pending">Pending</option>
//           <option value="confirmed">Confirmed</option>
//           <option value="cancelled">Cancelled</option>
//         </select>
//       </div>

//       {/* Summary table */}
//       <h3>Summary by costume</h3>
//       <table style={{ borderCollapse:"collapse", width:"100%", marginBottom:16 }}>
//         <thead>
//           <tr>
//             <Th>Costume</Th>
//             <Th>Total qty</Th>
//             <Th>By size / status</Th>
//           </tr>
//         </thead>
//         <tbody>
//           {summary.map(s=>(
//             <tr key={s.costumeId}>
//               <Td>{s.costumeTitle}</Td>
//               <Td>{s.total}</Td>
//               <Td>
//                 {groupBySizeStatus(s.bySize).map(line => (
//                   <div key={line.key}>
//                     <code>{line.size}</code>: {line.qty} ({line.status})
//                   </div>
//                 ))}
//               </Td>
//             </tr>
//           ))}
//           {summary.length === 0 && <tr><Td colSpan="3">No data</Td></tr>}
//         </tbody>
//       </table>

//       {/* Raw list */}
//       <h3>Reservations list{status ? ` — ${status}` : ""}</h3>
//       <table style={{ borderCollapse:"collapse", width:"100%" }}>
//         <thead>
//           <tr>
//             <Th>Created</Th>
//             <Th>Costume</Th>
//             <Th>Size</Th>
//             <Th>Qty</Th>
//             <Th>Status</Th>
//             <Th>User</Th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map(r=>(
//             <tr key={r._id}>
//               <Td>{new Date(r.createdAt).toLocaleString()}</Td>
//               <Td>{r.costume?.title || "-"}</Td>
//               <Td>{r.size}</Td>
//               <Td>{r.qty}</Td>
//               <Td>{r.status}</Td>
//               <Td>{r.user?.email || "-"}</Td>
//             </tr>
//           ))}
//           {rows.length === 0 && <tr><Td colSpan="6">No reservations</Td></tr>}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function groupBySizeStatus(items){
//   // items: [{ size, status, qty }]
//   const key = (s, st) => `${s}|${st}`;
//   const map = new Map();
//   items.forEach(i=>{
//     const k = key(i.size, i.status);
//     map.set(k, (map.get(k)||0) + i.qty);
//   });
//   return Array.from(map.entries()).map(([k, qty])=>{
//     const [size, status] = k.split("|");
//     return { key:k, size, status, qty };
//   }).sort((a,b)=>a.size.localeCompare(b.size) || a.status.localeCompare(b.status));
// }

// function Th({children}){ return <th style={{ border:"1px solid #333", padding:8, textAlign:"left" }}>{children}</th>; }
// function Td({children, ...rest}){ return <td {...rest} style={{ border:"1px solid #333", padding:8 }}>{children}</td>; }
