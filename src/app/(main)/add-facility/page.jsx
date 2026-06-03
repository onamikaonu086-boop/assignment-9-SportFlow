"use client";

import PageTitle from "@/components/PageTitle";
import { useSession } from "@/lib/auth-client"; 
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

const facilityTypes = ["Football", "Badminton", "Swimming", "Tennis", "Cricket"];

export default function AddFacilityPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession(); 
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
        <p className="text-red-500 font-bold text-xl">Access Denied! Please log in to add a facility.</p>
        <Button 
          onClick={() => router.push("/login")} 
          className="bg-indigo-600 text-white font-bold rounded-xl"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const user = session?.user;

    if (!user) {
      toast.error("Please log in to add a facility");
      return;
    }

    const formData = new FormData(form);
    const facilityData = Object.fromEntries(formData.entries());

    const finalData = {
      name: facilityData.name,
      facility_type: facilityData.facility_type,
      location: facilityData.location,
      price_per_hour: Number(facilityData.price_per_hour),
      capacity: Number(facilityData.capacity),         
      image: facilityData.image,
      description: facilityData.description,
      owner_email: user.email,                       
      booking_count: 0,                              
      available_slots: ["08:00 AM - 10:00 AM", "02:00 PM - 04:00 PM", "06:00 PM - 08:00 PM"], 
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-facility`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        toast.success("Facility listed successfully!");
        form.reset();
        router.push("/manage-my-facilities");
      } else {
        toast.error("Failed to add facility. Try again.");
      }
    } catch (error) {
      console.error("Error sending data:", error);
      toast.error("Something went wrong. Connecting to server failed.");
    }
  };

  return (
    <>
      <PageTitle title="Add Facility" />
      <div className="min-h-screen flex items-center justify-center py-6 px-3 sm:p-6 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-4xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 bg-white dark:bg-slate-900">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">Add New Facility</h1>
            <p className="text-sm sm:text-lg text-gray-500 dark:text-gray-400">
              List your sports venue for the community
            </p>
          </div>

          <Form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              
              {/* Facility Name */}
              <div className="md:col-span-2 w-full">
                <TextField name="name" isRequired className="w-full">
                  <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">Facility Name</label>
                  <Input placeholder="e.g. Jashore Turf Arena" className="w-full" />
                </TextField>
              </div>

              {/* Facility Type Dropdown */}
              <div className="w-full">
                <Select name="facility_type" isRequired placeholder="Select sport type" className="w-full">
                  <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">Facility Type</label>
                  <Select.Trigger className="w-full min-h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 text-left">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg">
                    <ListBox>
                      {facilityTypes.map((type) => (
                        <ListBox.Item 
                          key={type} 
                          id={type} 
                          textValue={type} 
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition text-slate-900 dark:text-slate-100"
                        >
                          {type}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              {/* Location */}
              <div className="w-full">
                <TextField name="location" isRequired className="w-full">
                  <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">Location</label>
                  <Input placeholder="e.g. Stadium Road, Jashore" className="w-full" />
                </TextField>
              </div>

              {/* Price Per Hour */}
              <div className="w-full">
                <TextField name="price_per_hour" isRequired className="w-full">
                  <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">Price Per Hour ($)</label>
                  <Input type="number" min="1" placeholder="500" className="w-full" />
                </TextField>
              </div>

              {/* Capacity */}
              <div className="w-full">
                <TextField name="capacity" isRequired className="w-full">
                  <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">Capacity (Persons)</label>
                  <Input type="number" min="1" placeholder="10" className="w-full" />
                </TextField>
              </div>

              {/* Image URL */}
              <div className="md:col-span-2 w-full">
                <TextField name="image" isRequired className="w-full">
                  <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">Image URL</label>
                  <Input placeholder="https://images.unsplash.com/..." className="w-full" />
                </TextField>
              </div>

              {/* Description */}
              <div className="md:col-span-2 w-full">
                <TextField name="description" isRequired className="w-full">
                  <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">Description</label>
                  <TextArea rows={3} placeholder="Tell us about your facility features..." className="w-full" />
                </TextField>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition shadow-md">
              Submit Facility Listing
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}