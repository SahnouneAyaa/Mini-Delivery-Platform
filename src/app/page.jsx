"use client";
import LeftSide from "@/components/signIn/LeftSide";
import RightSide from "@/components/signIn/RightSide";



export default function SignInForm() {

  return (
    <div className="min-h-screen flex font-[\'Outfit\',sans-serif] bg-[#F7F8FA]">
      <LeftSide/>
      <RightSide/>
    </div>
  );
}
