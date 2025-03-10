"use client";
import { deleteReview, getReview } from "@/services/review";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MdClose } from "react-icons/md";
import Image from "next/image";

interface review {
  _id: string;
  userID: {
    fullName: string;
    _id: string;
  };
  comment: string;
  commentTitle: string;
  createdAt: string;
  updatedAt: string;
  rating: number;
}

const Review = () => {
  const [reviews, setReviews] = useState<Array<review>>([]);
  const [nextDisable, setNextDisable] = useState(false);
  const [previousDisable, setPreviousDisable] = useState(true);
  const [page, setPage] = useState(1);

  const fetchData = async (page: number, limit: number) => {
    try {
      const data = await getReview(page, limit);
      console.log(data);

      setPage(data.currentPage);
      if (data.currentPage === data.totalPages) {
        setNextDisable(true);
      } else {
        setNextDisable(false);
      }
      if (data.currentPage === 1) {
        setPreviousDisable(true);
      } else {
        setPreviousDisable(false);
      }
      console.log(data);
      setReviews(data?.reviews);
      console.log(reviews);
    } catch (err: unknown) {
      console.log(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id);
      fetchData(page, 12);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData(page, 12);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-3 gap-x-4 gap-y-9">
        {reviews.map((review, index) => {
          const current_date = new Date(review.createdAt);
          const formattedDate = current_date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          });
          return (
            <div
              key={index}
              className="w-80 h-fit rounded-md bg-[#F2F7FB] p-7 relative"
            >
              <div className="flex justify-between text-center items-center">
                <div className="bg-red-600 rounded-full w-9 h-9 overflow-hidden mr-6 ">
                  <Image
                    width={100}
                    height={100}
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      review?.userID?.fullName || "NA"
                    )}&background=E4C087&color=FFFFFF`}
                    alt="User Avatar"
                  />
                </div>

                <div className="flex ">
                  {[...Array(review.rating)].map((star, index) => {
                    return (
                      <div key={index}>
                        <FaStar size={15} className="text-orange-200" />
                      </div>
                    );
                  })}
                  {[...Array(5 - review.rating)].map((star, index) => {
                    return (
                      <div key={index}>
                        <FaStar size={15} className="text-gray-400" />
                      </div>
                    );
                  })}
                </div>
                <div>{formattedDate}</div>
              </div>
              <div className="mt-4 font-thin">
                <div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <MdClose className="text-red-600 text-2xl absolute cursor-pointer right-0 top-0" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the review and remove the data from your
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600"
                          onClick={() => handleDelete(review._id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <h1 className="font-semibold">{review.userID?.fullName}</h1>
                <p className="mt-2">{review.comment}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchData(page - 1, 12)}
          disabled={previousDisable}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchData(page + 1, 12)}
          disabled={nextDisable}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Review;
