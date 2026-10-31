import { request } from "./api/client";
import type { EnquiryInput } from "../types/enquiry";

export const submitEnquiry = (input: EnquiryInput) =>
  request<unknown>("/enquiries", {
    method: "POST",
    body: JSON.stringify({ ...input, source: "android" }),
  });