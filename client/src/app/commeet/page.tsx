"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import { FunctionComponent, useCallback } from 'react';
import { useRouter } from "next/navigation";

const CommeetPage = () => {
  const router = useRouter();

  const onLetsMeetBtnClick = useCallback(() => {
    router.push("/commeet/meetinfo"); // navigate to commeetpage1
  }, [router]);
  	
  	return (
        <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />
    		<div className="w-full relative bg-white overflow-hidden text-left text-[60px] text-black font-rubik flex-1">
      			<b className="absolute top-[150px] left-[75px] leading-[125%] inline-block w-[287px] text-primary1">
        				<span>com</span>
        				<span className="text-black">meet</span>
      			</b>
      			<div className="absolute top-[305px] left-[calc(50%_-_627px)] text-[32px] tracking-[0.01em] leading-[125%] font-raleway text-center inline-block w-[612px]">What days would you like to meet on?</div>
        				<img className="absolute top-[calc(50%_-_65px)] left-[calc(50%_+_596px)] w-[35px] h-[57px]" alt="" />
        				<img className="absolute top-[calc(50%_-_65px)] left-[calc(50%_-_636px)] w-[35px] h-[57px] object-contain" alt="" />
        				<div className="absolute top-[299px] left-[1187px] w-40 h-[52px] cursor-pointer text-[16px] font-manrope" onClick={onLetsMeetBtnClick}>
          					<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[20px] border-black border-solid border-[2px] box-border overflow-hidden flex items-center py-4 px-2.5">
            						<div className="flex items-start py-0 px-4">
              							<div className="relative leading-[125%] font-semibold">Let's meet</div>
            						</div>
          					</div>
          					<img className="absolute h-[57.69%] w-[18.75%] top-[21.15%] right-[10%] bottom-[21.15%] left-[71.25%] max-w-full overflow-hidden max-h-full" alt="" />
        				</div>
        				<div className="absolute top-[459px] left-[calc(50%_-_570px)] w-[1140px] h-[958px] text-center text-[37px] text-white font-inter mb-8">
          					<div className="absolute top-[0px] left-[calc(50%_-_570px)] shadow-[4px_4px_4px_3px_rgba(0,_0,_0,_0.25)] rounded-[20px] border-gray-500 border-solid border-[3px] box-border w-[1140px] h-[958px]" />
          					<div className="absolute top-[72px] left-[35px] w-[1070px] h-[70px]">
            						<div className="absolute top-[0px] left-[0px] rounded-[15px] bg-primary1 w-[1070px] h-[70px]" />
            						<div className="absolute top-[12px] left-[calc(50%_-_141px)] tracking-[2px] font-extrabold">October 2025</div>
          					</div>
          					<div className="absolute top-[175px] left-[33px] w-[1074px] h-[750px] text-[35px] text-black">
            						<div className="absolute top-[0px] left-[5px] w-[1060px] h-[100px]">
              							<div className="absolute top-[0px] left-[0px] w-[100px] h-[100px]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                  									<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                  									<div className="absolute top-[29%] left-[17%]">Sun</div>
                								</div>
              							</div>
              							<div className="absolute top-[0px] left-[160px] w-[100px] h-[100px]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                  									<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                  									<div className="absolute top-[29%] left-[13%]">Mon</div>
                								</div>
              							</div>
              							<div className="absolute top-[0px] left-[320px] w-[100px] h-[100px]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                  									<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                  									<div className="absolute top-[29%] left-[19%]">Tue</div>
                								</div>
              							</div>
              							<div className="absolute top-[0px] left-[480px] w-[100px] h-[100px]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                  									<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                  									<div className="absolute top-[29%] left-[12%]">Wed</div>
                								</div>
              							</div>
              							<div className="absolute top-[0px] left-[640px] w-[100px] h-[100px]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                  									<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                  									<div className="absolute top-[29%] left-[17%]">Thu</div>
                								</div>
              							</div>
              							<div className="absolute top-[0px] left-[800px] w-[100px] h-[100px]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                  									<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                  									<div className="absolute top-[29%] left-[28%]">Fri</div>
                								</div>
              							</div>
              							<div className="absolute top-[0px] left-[960px] w-[100px] h-[100px]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                  									<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                  									<div className="absolute top-[29%] left-[22%]">Sat</div>
                								</div>
              							</div>
            						</div>
            						<div className="absolute top-[130px] left-[5px] w-[100px] h-[100px] text-gray-400">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[28%]">28</div>
              							</div>
            						</div>
            						<div className="absolute top-[130px] left-[165px] w-[100px] h-[100px] text-gray-400">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[27%]">29</div>
              							</div>
            						</div>
            						<div className="absolute top-[130px] left-[325px] w-[100px] h-[100px] text-gray-400">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[27%]">30</div>
              							</div>
            						</div>
            						<div className="absolute top-[130px] left-[485px] w-[100px] h-[100px] text-left">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[41%]">1</div>
              							</div>
            						</div>
            						<div className="absolute top-[130px] left-[645px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[38%]">2</div>
              							</div>
            						</div>
            						<div className="absolute top-[130px] left-[805px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[38%]">3</div>
              							</div>
            						</div>
            						<div className="absolute top-[130px] left-[965px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[38%]">4</div>
              							</div>
            						</div>
            						<div className="absolute top-[260px] left-[5px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[38%]">5</div>
              							</div>
            						</div>
            						<div className="absolute top-[260px] left-[165px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[38%]">6</div>
              							</div>
            						</div>
            						<div className="absolute top-[260px] left-[325px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[39%]">7</div>
              							</div>
            						</div>
            						<div className="absolute top-[260px] left-[485px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[38%]">8</div>
              							</div>
            						</div>
            						<div className="absolute top-[260px] left-[645px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[38%]">9</div>
              							</div>
            						</div>
            						<div className="absolute top-[260px] left-[805px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[30%]">10</div>
              							</div>
            						</div>
            						<div className="absolute top-[260px] left-[965px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[33%]">11</div>
              							</div>
            						</div>
            						<div className="absolute top-[390px] left-[5px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[30%]">12</div>
              							</div>
            						</div>
            						<div className="absolute top-[390px] left-[165px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[30%]">13</div>
              							</div>
            						</div>
            						<div className="absolute top-[390px] left-[325px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[30%]">14</div>
              							</div>
            						</div>
            						<div className="absolute top-[390px] left-[485px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[30%]">15</div>
              							</div>
            						</div>
            						<div className="absolute top-[390px] left-[645px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[30%]">16</div>
              							</div>
            						</div>
            						<div className="absolute top-[390px] left-[805px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[31%]">17</div>
              							</div>
            						</div>
            						<div className="absolute top-[390px] left-[965px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[30%]">18</div>
              							</div>
            						</div>
            						<div className="absolute top-[520px] left-[5px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[30%]">19</div>
              							</div>
            						</div>
            						<div className="absolute top-[520px] left-[165px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[27%]">20</div>
              							</div>
            						</div>
            						<div className="absolute top-[520px] left-[325px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[30%]">21</div>
              							</div>
            						</div>
            						<div className="absolute top-[520px] left-[485px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[28%]">22</div>
              							</div>
            						</div>
            						<div className="absolute top-[520px] left-[645px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[27%]">23</div>
              							</div>
            						</div>
            						<div className="absolute top-[520px] left-[805px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[27%]">24</div>
              							</div>
            						</div>
            						<div className="absolute top-[520px] left-[965px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[28%]">25</div>
              							</div>
            						</div>
            						<div className="absolute top-[650px] left-[5px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[27%]">26</div>
              							</div>
            						</div>
            						<div className="absolute top-[650px] left-[165px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[28%]">27</div>
              							</div>
            						</div>
            						<div className="absolute top-[650px] left-[325px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[28%]">28</div>
              							</div>
            						</div>
            						<div className="absolute top-[650px] left-[485px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[27%]">29</div>
              							</div>
            						</div>
            						<div className="absolute top-[650px] left-[645px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[27%]">30</div>
              							</div>
            						</div>
            						<div className="absolute top-[650px] left-[805px] w-[100px] h-[100px]">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[30%]">31</div>
              							</div>
            						</div>
            						<div className="absolute top-[650px] left-[965px] w-[100px] h-[100px] text-left text-gray-400">
              							<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%]">
                								<div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50px] bg-gray-300" />
                								<div className="absolute top-[29%] left-[41%]">1</div>
              							</div>
            						</div>
            						<div className="absolute top-[99.91px] left-[0px] border-gray-300 border-solid border-t-[1px] box-border w-[1075px] h-px" />
          					</div>
        				</div>
        				</div>
      			<Footer />
        				</div>);

      			};
      			
      			export default CommeetPage as FunctionComponent;