"use client";

import PageTitle from "@/components/PageTitle";
import { useSession } from "@/lib/auth-client"; // Better Auth এর সেশন হুক
import {
  Input,
  TextArea,
  Select,
  Button,
  TextField,
  ListBox,
  Form,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// অ্যাসাইনমেন্টের রিকোয়ারমেন্ট অনুযায়ী টাইপসমূহ
const facilityTypes = ["Football", "Badminton", "Swimming", "Tennis", "Cricket"];

export default function AddFacilityPage() {
  const router = useRouter();
  const { data: session } = useSession(); // লগইন থাকা ইউজারের ডাটা নেয়ার জন্য

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const user = session?.user;

    // ১. ইউজার লগইন না থাকলে আটকানোর সিকিউরিটি গার্ড
    if (!user) {
      toast.error("Please log in to add a facility");
      return;
    }

    const formData = new FormData(form);
    const facilityData = Object.fromEntries(formData.entries());

    // ২. ডাটাবেজ আর্কিটেকচার অনুযায়ী অতিরিক্ত ডেটা পুশ করা
    const finalData = {
      ...facilityData,
      price_per_hour: Number(facilityData.price_per_hour), // সংখ্যায় রূপান্তর
      capacity: Number(facilityData.capacity),             // সংখ্যায় রূপান্তর
      owner_email: user.email,                             // রিকোয়ারমেন্ট: Auto-fill Owner Email
      booking_count: 0,                                    // রিকোয়ারমেন্ট: ডিফল্ট সংখ্যা
      available_slots: ["08:00 AM - 10:00 AM", "02:00 PM - 04:00 PM", "06:00 PM - 08:00 PM"], // ডামি বা পছন্দমতো স্লট
    };

    try {
      const res = await fetch("http://localhost:8000/add-facility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        toast.success("Facility listed successfully!");
        form.reset(); // ফর্ম ক্লিয়ার করা
        router.push("/manage-my-facilities");
      } else {
        toast.error("Failed to add facility");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <>
      <PageTitle title="Add Facility" />
      <div className="min-h-screen flex items-center justify-center py-6 px-3 sm:p-6">
        <div className="w-full max-w-4xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 bg-white dark:bg-slate-900">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">Add New Facility</h1>
            <p className="text-sm sm:text-lg text-gray-500">
              List your sports venue for the community
            </p>
          </div>

          <Form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Facility Name */}
              <div className="md:col-span-2">
                <TextField name="name" isRequired>
                  <label className="block mb-1 font-medium">Facility Name</label>
                  <Input placeholder="e.g. Jashore Turf Arena" />
                </TextField>
              </div>

              {/* Facility Type Dropdown - ঠিক রেফারেন্স কোডের স্টাইলে */}
              <Select name="facility_type" isRequired placeholder="Select sport type">
                <label className="block mb-1 font-medium">Facility Type</label>
                <Select.Trigger className="w-full min-h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg">
                  <ListBox>
                    {facilityTypes.map((type) => (
                      <ListBox.Item key={type} id={type} textValue={type} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                        {type}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              {/* Location */}
              <TextField name="location" isRequired>
                <label className="block mb-1 font-medium">Location</label>
                <Input placeholder="e.g. Stadium Road, Jashore" />
              </TextField>

              {/* Price Per Hour */}
              <TextField name="price_per_hour" isRequired>
                <label className="block mb-1 font-medium">Price Per Hour ($)</label>
                <Input type="number" placeholder="500" />
              </TextField>

              {/* Capacity */}
              <TextField name="capacity" isRequired>
                <label className="block mb-1 font-medium">Capacity (Persons)</label>
                <Input type="number" placeholder="10" />
              </TextField>

              {/* Image URL */}
              <div className="md:col-span-2">
                <TextField name="image" isRequired>
                  <label className="block mb-1 font-medium">Image URL</label>
                  <Input placeholder="https://images.unsplash.com/..." />
                </TextField>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <TextField name="description" isRequired>
                  <label className="block mb-1 font-medium">Description</label>
                  <TextArea rows={3} placeholder="Tell us about your facility features..." />
                </TextField>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition">
              Submit Facility Listing
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}