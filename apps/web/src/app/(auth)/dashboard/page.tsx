import React from "react";

import { requireAuth } from "@/utils/auth";

import Dashboard from "./Dashboard";

const Page = async () => {
  await requireAuth();

  return <Dashboard />;
};

export default Page;
