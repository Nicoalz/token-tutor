"use client";
import { useEffect, useState } from "react";

export default function Avatar({ address }: { address: string }) {
  return <img className="w-20" src={"https://robohash.org/" + address} />;
}
