import { BorderCard } from "@/app/components/BorderCard";
import { NewsletterSignUp } from "@/app/components/NewsletterSignUp";
import { hardwareData, softwareData } from "app/data/toolbox";
import { HorizontalLine } from "@/app/components/HorizontalLine";
import { GridWrapper } from "@/app/components/GridWrapper";

export default function ToolboxPage() {
  return (
    <div className="relative">
      <title>Toolbox | Abhijit Satyaki</title>
      <span className="absolute left-1/2 top-20 -translate-y-1/2 translate-x-1/2">
        <HorizontalLine />
      </span>
      <div className="relative space-y-10 md:space-y-16">
        <div className="mx-auto text-balance pt-14 md:pt-16">
          <GridWrapper>
            <h1 className="mx-auto max-w-2xl text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
              Hardware & software I keep in my toolbox.
            </h1>
          </GridWrapper>
        </div>
        <span className="absolute left-1/2 top-40 -translate-y-1/2 translate-x-1/2">
          <HorizontalLine />
        </span>

        {/* Technologies & Tools */}
        <div className="relative">
          <GridWrapper>
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>Technologies & Tools</span>
            </div>
          </GridWrapper>
        </div>
        {/* List - 10 logos in a row */}
        <GridWrapper>
          <div className="relative grid grid-cols-5 place-items-center gap-y-6 gap-x-2 sm:grid-cols-5 md:grid-cols-10 md:gap-x-2 lg:gap-x-3 lg:gap-y-8">
            {softwareData.map((item) => (
              <a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group no-underline transition-all duration-300"
              >
                <div className="group flex flex-col items-center text-center">
                  <div className="h-20 w-20 rounded-[18px] border border-border-primary bg-bg-primary p-1.5 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-indigo-400 group-hover:shadow-md lg:h-24 lg:w-24 lg:rounded-[20px] lg:p-2">
                    <div
                      className="grid h-full w-full place-items-center rounded-xl border-2 border-[#A5AEB81F]/10 bg-[#EDEEF0] p-1.5"
                      style={{ boxShadow: "0px 2px 1.5px 0px #A5AEB852 inset" }}
                    >
                      <img
                        className="h-7 w-7 object-contain transition-transform duration-300 group-hover:scale-110 lg:h-9 lg:w-9"
                        alt={item.title}
                        src={item.imgSrc}
                      />
                    </div>
                  </div>
                  {item.title ? (
                    <p className="mt-2 max-w-[76px] truncate text-[11px] font-medium text-text-secondary transition-colors group-hover:text-text-primary sm:text-xs lg:max-w-[90px] lg:text-sm">
                      {item.title}
                    </p>
                  ) : null}
                </div>
              </a>
            ))}
          </div>
        </GridWrapper>

        {/* Hardware */}
        <div className="relative">
          <GridWrapper>
            <div className="text-center text-sm font-medium text-indigo-600">
              <span>Hardware Setup</span>
            </div>
          </GridWrapper>
        </div>

        <div>
          <GridWrapper>
            <div className="grid grid-cols-1 grid-rows-2 gap-2 md:grid-cols-3">
              {hardwareData.map((item) => (
                <a
                  href={item.link}
                  className="group block h-full"
                  key={item.title}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BorderCard>
                    <div className="flex flex-col space-y-3">
                      <p className="text-base font-semibold leading-5 text-text-primary">
                        {item.title}
                      </p>
                      <p className="leading-6 text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <span className="inline-block text-right">
                      <span className="text-sm text-purple-primary/50 group-hover:text-purple-primary">
                        Learn more
                      </span>
                    </span>
                  </BorderCard>
                </a>
              ))}
            </div>
          </GridWrapper>
        </div>

        {/* Contact / Newsletter Form */}
        <NewsletterSignUp />
      </div>
    </div>
  );
}
