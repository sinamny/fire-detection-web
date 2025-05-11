// import React from "react";
// import { Download } from "lucide-react";
// import "./Manage.css";

// const Manage = () => {

//     const handleDownload = (filename = "free_fire_abc_video.mp4") => {
//     const blob = new Blob(["Fake MP4 content here"], { type: "video/mp4" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="manage-container">
//       <div className="model-info">
//         <h2 className="model-title">THÔNG TIN CHI TIẾT MÔ HÌNH PHÁT HIỆN ĐÁM CHÁY</h2>
//         <p className="model-name">
//           Mô hình: <span className="highlight">YOLOv11</span>
//         </p>
//         <div className="model-metrics">
//           <div>mAR: 93,33 %</div>
//           <div>mIoU: 77,86 %</div>
//           <div>F-m: 50,76%</div>
//         </div>
//       </div>

//       <div className="history-section">
//         <h3 className="history-title">Lịch sử hệ thống</h3>
//         <div className="table-wrapper">
//           <table className="history-table">
//             <thead>
//               <tr>
//                 <th>Người dùng</th>
//                 <th>Ngày</th>
//                 <th>Giờ</th>
//                 <th>Video</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Array.from({ length: 10 }).map((_, idx) => (
//                <tr key={idx}>
//                   <td>ABC</td>
//                   <td>1/1/2025</td>
//                   <td>23:00</td>
//                  <td className="video-cell">
//                     <span className="video-name">Video Name ABC</span>
//                     <button
//                         className="download-icon-button"
//                         onClick={() => handleDownload(`video_abc_${idx + 1}.mp4`)}
//                         aria-label="Tải video"
//                     >
//                         <Download size={18} />
//                     </button>
//                     </td>

//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Manage;
import React, { useState } from "react";
import { Table, Button } from "antd";
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import "./Manage.css";

const Manage = () => {

  const handleDownload = (filename = "free_fire_abc_video.mp4") => {
    const blob = new Blob(["Fake MP4 content here"], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
   const [page, setPage] = useState(1);
   const [pageSize, setPageSize] = useState(5);

  

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "user",
      key: "user",
      sorter: (a, b) => a.user.localeCompare(b.user),
      align: "center",
       render: (text) => (
        <span style={{ textAlign: "left", display: "block" }}>{text}</span>
      ),
      width: 200,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      align: "center",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      width: 150,
    },
    {
      title: "Giờ",
      dataIndex: "time",
      key: "time",
      sorter: (a, b) => a.time.localeCompare(b.time),
      align: "center",
      width: 120,
    },
    {
      title: "Video",
      dataIndex: "videoName",
      key: "videoName",
      render: (text, record) => (
        <div className="video-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="video-name" style={{ textAlign: "left" }}>
            {text}
            </span>
            <Button
            type="link"
            icon={<SaveAltOutlinedIcon className="custom-download-icon" />}
            onClick={() => handleDownload(record.videoFile)}
            style={{ paddingLeft: 10 }}
            />
        </div>
        ),

      align: "center",
    },
  ];

  const handlePageSizeChange = (current, size) => {
    setPage(current);
    setPageSize(size);
  };

  const data = Array.from({ length: 20 }).map((_, idx) => ({
    key: idx,
    user: "Nguyễn Thị Nguyệt",
    date: "2025-01-01",
    time: "23:00",
    videoName: `Video ABC ${idx + 1}`,
    videoFile: `video_abc_${idx + 1}.mp4`,
  }));

  return (
    <div className="manage-container">
      <div className="model-info">
        <h2 className="model-title">THÔNG TIN CHI TIẾT MÔ HÌNH PHÁT HIỆN ĐÁM CHÁY</h2>
        <p className="model-name">
          Mô hình: <span className="highlight">YOLOv11</span>
        </p>
        <div className="model-metrics">
          <div>mAR: 93,33 %</div>
          <div>mIoU: 77,86 %</div>
          <div>F-m: 50,76%</div>
        </div>
      </div>

      <div className="history-section">
        <h3 className="history-title">Lịch sử hệ thống</h3>
        <div className="table-wrapper">
          <Table columns={columns} dataSource={data} 
            pagination={{
                current: page,
                pageSize,
                total: data.length,
                onChange: (page) => setPage(page),
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ["5","10", "15", "20", "30"],
                onShowSizeChange: handlePageSizeChange,
                showTotal: (total, range) => `${range[0]}-${range[1]} trong tổng số ${total} bản ghi`,
                locale: {
                  items_per_page: "bản ghi / trang",
                  jump_to: "Đi tới",
                  jump_to_confirm: "Xác nhận",
                  page: "Trang",
                  prev_page: "Trang trước",
                  next_page: "Trang sau",
                  prev_5: "Lùi 5 trang",
                  next_5: "Tiến 5 trang",
                  prev_3: "Lùi 3 trang",
                  next_3: "Tiến 3 trang",
                },
                }}
            bordered/>
        </div>
      </div>
    </div>
  );
};

export default Manage;
