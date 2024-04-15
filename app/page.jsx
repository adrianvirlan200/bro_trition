//"use client";
import WelcomePage from "@components/WelcomePage.jsx"; // Path: app/page.jsx6+9`+9`
import Image from "next/image";
import executeQuery from "../server/db";
// Rest of the code...

const first_page = async () => {
  const q = "SELECT * FROM brotrition.user;";
  const result = await executeQuery(q, []);

  return (
    <div>
      <div className="p-5">
        {JSON.stringify(result) || "No data found"}
        <WelcomePage />
      </div>
    </div>
  );
};

export default first_page;
