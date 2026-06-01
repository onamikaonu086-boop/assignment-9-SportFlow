"use client";

import { useEffect } from "react";

export default function PageTitle({ title }) {
  useEffect(() => {
    document.title = title ? `${title} | SportFlow` : "SportFlow – Sports Facility Listing";
  }, [title]);

  return null;
}
