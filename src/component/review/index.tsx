"use client";
import { deleteReview, getReview } from "@/services/review";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FiCalendar } from "react-icons/fi";
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
import { Avatar } from '@heroui/avatar';
import Loader from "../Loader";

interface Review {
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
  const [reviews, setReviews] = useState<Array<Review>>([]);
  const [nextDisable, setNextDisable] = useState(false);
  const [previousDisable, setPreviousDisable] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const data = await getReview(page, limit);
      
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
      
      setReviews(data?.reviews);
      setLoading(false);
    } catch (err: unknown) {
      console.log(err);
      setLoading(false);
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
    <>
    {loading && (
      <Loader/>
    )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => {
          const current_date = new Date(review.createdAt);
          const formattedDate = current_date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
          });
          
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 relative group"
            >
              {/* Delete Button */}
              <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="p-1 bg-red-50 hover:bg-red-100 rounded-full text-red-500 transition-colors">
                      <MdClose className="text-xl" />
                    </button>
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
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDelete(review._id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Card Header */}
              <div className="bg-primaryColor text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-300" : "text-white"}`} 
                      />
                    ))}
                  </div>
                  <span className="flex items-center text-sm">
                    <FiCalendar className="mr-1" />
                    {formattedDate}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center mb-4">
                  <div className="overflow-hidden mr-3">
                    <Avatar
                                            color='warning'
                                            as="button"
                                            size="md"
                                            src={`https://ui-avatars.com/api/?name=${review?.userID?.fullName}&background=E4C087&color=ffff`}
                                        />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{review.userID?.fullName}</h3>
                    <p className="text-xs text-gray-500">Customer</p>
                  </div>
                </div>

                {review.commentTitle && (
                  <h4 className="font-semibold text-lg mb-2">{review.commentTitle}</h4>
                )}

                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                  <p className="text-gray-700 italic">"{review.comment}"</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchData(page - 1, 12)}
          disabled={previousDisable}
          className="flex items-center gap-1"
        >
          <BiChevronLeft className="text-lg" />
          Previous
        </Button>
        <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium">
          Page {page}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchData(page + 1, 12)}
          disabled={nextDisable}
          className="flex items-center gap-1"
        >
          Next
          <BiChevronRight className="text-lg" />
        </Button>
      </div>
    </>
  );
};

export default Review;