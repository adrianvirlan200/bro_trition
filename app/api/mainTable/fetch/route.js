import executeQuery from "@server/db.js";
import { data } from "autoprefixer";
import { NextResponse } from "next/server";

function displayNumberOfCalories(pr, ca, ft) {
  let x = pr * 4 + ca * 4 + ft * 9;
  x = Math.trunc(100 * x) / 100;
  x = x.toString();
  return x;
}

export async function GET(request) {
  try {
    const selectFoodQuery = "SELECT * FROM foods WHERE 1;";
    const result = await executeQuery(selectFoodQuery, []);

    //console.log(result[0].foodID);

    for (let i = 0; i < result.length; i++) {
      result[i].calories = displayNumberOfCalories(
        parseFloat(result[i].proteins),
        parseFloat(result[i].carbs),
        parseFloat(result[i].fats)
      );
    }

    if (result.length > 0) {
      return new Response(
        JSON.stringify({
          message: "Fetching successful.",
          data: result,
          status: 200,
        })
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "No entries found.",
          data: [],
          status: 200,
        })
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "An error occurred.", data: [], status: 500 })
    );
  }
}
