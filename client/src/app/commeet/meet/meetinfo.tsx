"use client";

import { FunctionComponent, useCallback } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";

const CommeetPage1: FunctionComponent = () => {
  const onLetsMeetBtnClick = useCallback(() => {
    // Add your navigation or action code here
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden text-left text-num-32 text-black font-raleway">
      <Header />

      <div className="relative flex-1 w-full overflow-hidden">
        <b className="absolute top-[250px] left-[75px] text-[60px] leading-[125%] inline-block font-rubik w-[287px] text-deepskyblue-200">
          <span>com</span>
          <span className="text-black">meet</span>
        </b>

        <div className="absolute top-[449px] left-[185px] border-gray-300 border-solid border-b-[1px] box-border w-num-960 h-10 text-gray-300">
          <div className="absolute top-[0px] left-[0px] tracking-num-0_01 leading-[50%] inline-block w-num-960 h-10">
            Name your meeting
          </div>
        </div>

        {/* ✅ CREATE BUTTON */}
        <div
          className="absolute top-[333px] left-[1171px] w-40 h-[52px] cursor-pointer text-center text-[16px] font-manrope"
          onClick={onLetsMeetBtnClick}
        >
          <div className="absolute h-full w-full top-0 right-0 bottom-0 left-0 rounded-[20px] border-black border-solid border-[2px] box-border overflow-hidden flex items-center py-num-16 px-[30px]">
            <div className="flex items-start justify-center py-0 px-num-16">
              <div className="relative leading-[125%] font-semibold">
                Create
              </div>
            </div>
          </div>
          <img
            className="absolute h-[57.69%] w-[18.75%] top-[21.15%] right-[10%] bottom-[21.15%] left-[71.25%] max-w-full overflow-hidden max-h-full"
            alt=""
          />
        </div>

        {/* ✅ TOP GRAY SECTION (kept intact from your layout) */}
        <div className="absolute top-[35px] left-[calc(50%_-_720px)] bg-gray-100 w-[1440px] flex items-center py-0 px-40 box-border gap-[25px] text-[30px] text-deepskyblue-100 font-rubik">
          <div className="h-[100px] w-[683px] relative">
            <img
              className="absolute top-[0px] left-[0px] w-[100px] h-[100px] object-cover"
              alt=""
            />
            <div className="absolute top-[8px] left-[110px] w-[573px] h-[84px]">
              <img
                className="absolute top-[7px] left-[0px] w-[305px] h-[75px]"
                alt=""
              />
              <div className="absolute top-[0px] left-[308px] w-[227px] h-[81px]">
                <b className="absolute top-[51.85%] left-[0%] leading-[125%]">
                  CIT-U Chapter
                </b>
                <b className="absolute top-[6px] left-[0px] leading-[125%]">
                  Region 7
                </b>
              </div>
            </div>
          </div>

          <div className="h-[52px] w-[74px] rounded-[100px] overflow-hidden shrink-0 flex items-center justify-center p-num-16 box-border" />

          <div className="h-[52px] w-[243px] relative text-[16px] font-manrope">
            <div className="absolute top-[0px] left-[133px] rounded-[15px] bg-lavender border-deepskyblue-100 border-solid border-[2px] overflow-hidden flex items-center justify-center p-num-16">
              <div className="flex items-start py-0 px-num-16">
                <div className="relative leading-[125%] font-semibold">
                  Log In
                </div>
              </div>
            </div>

            <div className="absolute top-[0px] left-[0px] rounded-[100px] w-[123px] overflow-hidden flex items-center justify-center p-num-16 box-border">
              <div className="flex items-start py-0 px-num-16">
                <div className="relative leading-[125%] font-semibold">
                  Sign Up
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Small grid-like icon (unchanged) */}
          <div className="h-10 w-[40.5px] relative">
            <div className="absolute top-[31.31px] left-[0px] rounded-num-3 bg-deepskyblue-100 border-deepskyblue-100 border-solid border-[1px] box-border w-num-8_8 h-num-8_7" />
            <div className="absolute top-[15.65px] left-[0px] rounded-num-3 bg-deepskyblue-100 border-deepskyblue-100 border-solid border-[1px] box-border w-num-8_8 h-num-8_7" />
            <div className="absolute top-[0px] left-[0px] rounded-num-3 bg-deepskyblue-100 border-deepskyblue-100 border-solid border-[1px] box-border w-num-8_8 h-num-8_7" />
            <div className="absolute top-[0px] left-[15.82px] rounded-num-3 bg-deepskyblue-100 border-deepskyblue-100 border-solid border-[1px] box-border w-num-8_8 h-num-8_7" />
            <div className="absolute top-[15.65px] left-[15.82px] rounded-num-3 bg-deepskyblue-100 border-deepskyblue-100 border-solid border-[1px] box-border w-num-8_8 h-num-8_7" />
            <div className="absolute top-[31.31px] left-[15.82px] rounded-num-3 bg-deepskyblue-100 border-deepskyblue-100 border-solid border-[1px] box-border w-num-8_8 h-num-8_7" />
            <div className="absolute top-[0px] left-[31.65px] rounded-num-3 bg-deepskyblue-100 border-deepskyblue-100 border-solid border-[1px] box-border w-num-8_8 h-num-8_7" />
            <div className="absolute top-[31.31px] left-[31.65px] rounded-num-3 bg-deepskyblue-100 border-deepskyblue-100 border-solid border-[1px] box-border w-num-8_8 h-num-8_7" />
            <div className="absolute top-[15.65px] left-[31.65px] rounded-num-3 bg-deepskyblue-100 border-deepskyblue-100 border-solid border-[1px] box-border w-num-8_8 h-num-8_7" />
          </div>
        </div>
      </div>

      {/* ✅ FOOTER */}
      <Footer />
    </div>
  );
};

export default CommeetPage1;
