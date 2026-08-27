export type NseMarketStatus = {
  isOpen: boolean;
  status: string;
  session: string;
  color: string;
};

export function getNseMarketStatus(
  date: Date
): NseMarketStatus {

  const indiaTime =
    new Date(
      date.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );

  const day =
    indiaTime.getDay();

  const hours =
    indiaTime.getHours();

  const minutes =
    indiaTime.getMinutes();


  // Saturday / Sunday
  if (
    day === 0 ||
    day === 6
  ) {
    return {
      isOpen: false,
      status: "🔴 MARKET CLOSED",
      session: "Weekend",
      color: "text-red-400",
    };
  }


  // Before 9:00 AM
  if (hours < 9) {
    return {
      isOpen: false,
      status: "🔵 MARKET NOT STARTED",
      session: "Pre-market",
      color: "text-blue-400",
    };
  }


  // 9:00 AM - 9:14 AM
  if (
    hours === 9 &&
    minutes < 15
  ) {
    return {
      isOpen: false,
      status: "🟡 PRE-OPEN SESSION",
      session: "Opening Session",
      color: "text-yellow-400",
    };
  }


  // 9:15 AM - 3:29 PM
  if (
    (
      hours > 9 ||
      (
        hours === 9 &&
        minutes >= 15
      )
    ) &&
    (
      hours < 15 ||
      (
        hours === 15 &&
        minutes < 30
      )
    )
  ) {
    return {
      isOpen: true,
      status: "🟢 LIVE TRADING",
      session: "Regular trading",
      color: "text-green-400",
    };
  }


  // After 3:30 PM
  return {
    isOpen: false,
    status: "🔴 MARKET CLOSED",
    session: "Market ended",
    color: "text-red-400",
  };
}