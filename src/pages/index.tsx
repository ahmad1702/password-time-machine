import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { passwordTable } from "@/lib/passwordTable";
import { classifyString, cn, intToString } from "@/lib/utils";
import { formatDistance } from "date-fns";
import { round } from "lodash-es";
import { Inter } from "next/font/google";
import { useMemo } from "react";

const inter = Inter({ subsets: ["latin"] });

const yearInMs = 3.15576e10;

const initTime = new Date(0);

export default function Home() {
  const [debouncedValue, value, setValue] = useDebounce("", 300);

  const timeInMs: number = useMemo(() => {
    if (debouncedValue.length < 4) return 0;

    const index = debouncedValue.length >= 18 ? 14 : debouncedValue.length - 4;
    const finalVal =
      passwordTable.at(index)?.at(classifyString(debouncedValue)) ?? 0;

    return finalVal;
  }, [debouncedValue]);

  let timeStr: string | null;
  if (debouncedValue.length === 0) {
    timeStr = null;
  } else if (debouncedValue.length < 4) {
    timeStr = "0 Seconds. Try making it atleast 3 characters.";
  } else if (timeInMs === 0) {
    timeStr = "0 Seconds. Consider it Public at this point...";
  } else if (timeInMs < yearInMs) {
    const timeAsDate = new Date(timeInMs);
    try {
      timeStr = formatDistance(initTime, timeAsDate, {
        includeSeconds: true,
      });
    } catch (error) {
      timeStr = "An Error Has Occurred";
    }
  } else {
    timeStr = intToString(round(timeInMs / yearInMs)) + " Years";
  }

  let statusLvl: number | null;
  if (debouncedValue.length === 0) {
    statusLvl = null;
  } else if (timeInMs === 0) {
    statusLvl = 0;
  } else if (timeInMs <= yearInMs) {
    // If <= 1 Year
    statusLvl = 1;
  } else if (timeInMs <= 3.15576e15) {
    // If <= 100k Years
    statusLvl = 2;
  } else if (timeInMs <= 7.889399e20) {
    // If <= 25bn Years
    statusLvl = 3;
  } else {
    // If > 25bn Years
    statusLvl = 4;
  }

  return (
    <main
      className={cn(
        "flex flex-col justify-center h-screen w-full gap-4 text-white items-center absolute",
        "bg-gradient-to-br from-[#c31432] to-[#240b36]"
      )}
    >
      <div className="max-w-2xl space-y-4">
        <h1 className="text-5xl font-bold">🔒 Password Time Machine</h1>
        <p className="">
          A lot of people think their passwords are tough. Enter that password
          and see how long it would take for someone to brute force your
          (supposedly good) password.
        </p>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-background/20 placeholder:text-gray-300 font-password text-lg px-4 h-auto"
          placeholder="Write your ideal password..."
          autoComplete="false"
        />
        {timeStr !== null && (
          <Card className="w-full max-w-2xl bg-background/20 text-white animate-in fade-in-0 fade-out-0 slide-in-from-top-5 slide-out-to-bottom-5">
            <CardHeader>
              <CardTitle
                key={timeStr}
                className="animate-in animate-out fade-in-0 fade-out-0 duration-75 slide-in-from-top-2 slide-out-to-bottom-2"
              >
                {timeStr}
              </CardTitle>

              {statusLvl !== null && (
                <>
                  <div>Strength:</div>
                  <div className="relative bg-neutral-300 h-3 w-full rounded overflow-hidden border border-neutral-300">
                    <div className="w-full h-full absolute top-0 left-0 flex justify-evenly">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="w-0.5 h-full bg-neutral-200"
                        ></div>
                      ))}
                    </div>
                    <div
                      className={cn(
                        "h-full duration-500",
                        statusLvl === 0 && "bg-purple-500 w-1/5",
                        statusLvl === 1 && "bg-red-500 w-2/5",
                        statusLvl === 2 && "bg-orange-500 w-3/5",
                        statusLvl === 3 && "bg-yellow-500 w-4/5",
                        statusLvl === 4 && "bg-green-500 w-full"
                      )}
                    />
                  </div>
                </>
              )}
            </CardHeader>
          </Card>
        )}
      </div>
      <footer className="absolute bottom-0 left-0 flex items-center p-4 w-full space-x-4">
        <div>
          Made By{" "}
          <a className="underline" href="https://www.ahmadsandid.com/">
            Ahmad Sandid
          </a>
        </div>
        <div className="w-0.5 h-6 bg-white rounded-full" />
        <div>
          Source Data from{" "}
          <a
            className="underline"
            href="https://www.hivesystems.io/password-table"
          >
            hivesystems
          </a>
        </div>
      </footer>
    </main>
  );
}
