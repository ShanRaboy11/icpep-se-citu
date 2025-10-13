function Logo() {
  return <div className="absolute left-0 size-[100px] top-0" data-name="logo" />;
}

function IcpepSe() {
  return (
    <div className="absolute font-['Rubik:Bold',_sans-serif] font-bold h-[84px] leading-[1.25] left-[85px] text-[#00a8f3] text-[27px] text-nowrap top-[8px] w-[573px] whitespace-pre" data-name="icpep se">
      <p className="absolute inset-[48.81%_19.55%_10.71%_46.95%]">CIT-U Chapter</p>
      <p className="absolute left-[269px] top-[10px]">Region 7</p>
    </div>
  );
}

function Icpep() {
  return (
    <div className="absolute h-[65px] left-[85px] top-[19px] w-[265px]" data-name="icpep">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 265 65">
        <g id="icpep">
          <path d="/Vector-dot.svg" fill="var(--fill-0, #00A8F3)" id="Vector" />
          <path d="/Vector-i.svg" fill="var(--fill-0, #252525)" id="Vector_2" />
          <path d="/Vector-c.svg" fill="var(--fill-0, #252525)" id="Vector_3" />
          <path d="/Vector-p1.svg" fill="var(--fill-0, #252525)" id="Vector_4" />
          <path d="/Vector-e1.svg" fill="var(--fill-0, #252525)" id="Vector_5" />
          <path d="/Vector-p2.svg" fill="var(--fill-0, #252525)" id="Vector_6" />
          <path d="/Vector-s.svg" fill="var(--fill-0, #252525)" id="Vector_7" />
          <path d="/Vector-e2.svg" fill="var(--fill-0, #252525)" id="Vector_8" />
        </g>
      </svg>
    </div>
  );
}

function IcpepHeader() {
  return (
    <div className="h-[100px] relative shrink-0 w-[546px]" data-name="icpep header">
      <Logo />
      <div className="absolute left-0 size-[75px] top-[12.5px]" data-name="icpep logo">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src='/icpep logo.png' />
      </div>
      <IcpepSe />
      <Icpep />
    </div>
  );
}

function Space() {
  return <div className="h-[52px] rounded-[100px] shrink-0 w-[210px]" data-name="Space" />;
}

function LabelContainer() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-start px-[16px] py-0 relative shrink-0" data-name="Label.Container">
      <p className="font-['Manrope:SemiBold',_sans-serif] font-semibold leading-[1.25] relative shrink-0 text-[#00a8f3] text-[16px] text-nowrap whitespace-pre">Log In</p>
    </div>
  );
}

function Login() {
  return (
    <div className="absolute bg-[#dbeeff] left-[133px] rounded-[10px] top-0" data-name="login">
      <div className="box-border content-stretch flex items-center justify-center overflow-clip p-[16px] relative rounded-[inherit]">
        <LabelContainer />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#00a8f3] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function LabelContainer1() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-start px-[16px] py-0 relative shrink-0" data-name="Label.Container">
      <p className="font-['Manrope:SemiBold',_sans-serif] font-semibold leading-[1.25] relative shrink-0 text-[#00a8f3] text-[16px] text-nowrap whitespace-pre">Sign Up</p>
    </div>
  );
}

function Signup() {
  return (
    <div className="absolute box-border content-stretch flex items-center justify-center left-0 overflow-clip p-[16px] rounded-[100px] top-0 w-[123px]" data-name="signup">
      <LabelContainer1 />
    </div>
  );
}

function ActionBtns() {
  return (
    <div className="h-[52px] relative shrink-0 w-[243px]" data-name="action btns">
      <Login />
      <Signup />
    </div>
  );
}

function Button() {
  return (
    <div className="[grid-area:1_/_1] bg-[#00a8f3] h-[8.654px] ml-0 mt-[31.308px] relative rounded-[3px] w-[8.824px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="h-[8.654px] w-[8.824px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#00a8f3] border-solid inset-0 pointer-events-none rounded-[3px]" />
    </div>
  );
}

function Button1() {
  return (
    <div className="[grid-area:1_/_1] bg-[#00a8f3] h-[8.654px] ml-0 mt-[15.654px] relative rounded-[3px] w-[8.824px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="h-[8.654px] w-[8.824px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#00a8f3] border-solid inset-0 pointer-events-none rounded-[3px]" />
    </div>
  );
}

function Button2() {
  return (
    <div className="[grid-area:1_/_1] bg-[#00a8f3] h-[8.654px] ml-0 mt-0 relative rounded-[3px] w-[8.824px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="h-[8.654px] w-[8.824px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#00a8f3] border-solid inset-0 pointer-events-none rounded-[3px]" />
    </div>
  );
}

function Button3() {
  return (
    <div className="[grid-area:1_/_1] bg-[#00a8f3] h-[8.654px] ml-[15.824px] mt-0 relative rounded-[3px] w-[8.824px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="h-[8.654px] w-[8.824px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#00a8f3] border-solid inset-0 pointer-events-none rounded-[3px]" />
    </div>
  );
}

function Button4() {
  return (
    <div className="[grid-area:1_/_1] bg-[#00a8f3] h-[8.654px] ml-[15.824px] mt-[15.654px] relative rounded-[3px] w-[8.824px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="h-[8.654px] w-[8.824px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#00a8f3] border-solid inset-0 pointer-events-none rounded-[3px]" />
    </div>
  );
}

function Button5() {
  return (
    <div className="[grid-area:1_/_1] bg-[#00a8f3] h-[8.654px] ml-[15.824px] mt-[31.308px] relative rounded-[3px] w-[8.824px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="h-[8.654px] w-[8.824px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#00a8f3] border-solid inset-0 pointer-events-none rounded-[3px]" />
    </div>
  );
}

function Button6() {
  return (
    <div className="[grid-area:1_/_1] bg-[#00a8f3] h-[8.654px] ml-[31.647px] mt-0 relative rounded-[3px] w-[8.824px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="h-[8.654px] w-[8.824px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#00a8f3] border-solid inset-0 pointer-events-none rounded-[3px]" />
    </div>
  );
}

function Button7() {
  return (
    <div className="[grid-area:1_/_1] bg-[#00a8f3] h-[8.654px] ml-[31.647px] mt-[31.308px] relative rounded-[3px] w-[8.824px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="h-[8.654px] w-[8.824px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#00a8f3] border-solid inset-0 pointer-events-none rounded-[3px]" />
    </div>
  );
}

function Button8() {
  return (
    <div className="[grid-area:1_/_1] bg-[#00a8f3] h-[8.654px] ml-[31.647px] mt-[15.654px] relative rounded-[3px] w-[8.824px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="h-[8.654px] w-[8.824px]" />
      </div>
      <div aria-hidden="true" className="absolute border border-[#00a8f3] border-solid inset-0 pointer-events-none rounded-[3px]" />
    </div>
  );
}

function Menu() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="menu">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
      <Button8 />
    </div>
  );
}

export default function HeaderGuest() {
  return (
    <div className="bg-[#fcfcfd] relative size-full" data-name="header (guest)">
      <div aria-hidden="true" className="absolute border-[#dddedf] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[25px] items-center px-[160px] py-0 relative size-full">
          <IcpepHeader />
          <Space />
          <ActionBtns />
          <Menu />
        </div>
      </div>
    </div>
  );
}