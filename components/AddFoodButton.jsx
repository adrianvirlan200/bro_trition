"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  CheckboxGroup,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  Button,
} from "@nextui-org/react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

import { useState, useEffect } from "react";
import Image from "next/image";
import { set } from "mongoose";

const AddFoodButton = ({ handleUpdateTable }) => {
  const [proteinsChart, setProteinsChart] = useState(0);
  const [carbsChart, setCarbsChart] = useState(0);
  const [fatsChart, setFatsChart] = useState(0);

  //prot #44d07b80
  //carbs #1ccad780
  //fats #ea3b0480

  const data_chart = {
    labels: ["Proteins", "Carbs", "Fats"],
    datasets: [
      {
        data: [proteinsChart, carbsChart, fatsChart],

        backgroundColor: [
          "rgba(68,208,123,0.5)",
          "rgba(28,202,215,0.5)",
          "rgba(234,59,4,0.5)",
        ],
        borderColor: [
          "rgba(68,208,123,0.8)",
          "rgba(28,202,215,0.8)",
          "rgba(234,59,4,0.8)",
        ],
        borderWidth: 2,
      },
    ],
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [searchBoxValue, setSearchBoxValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState("");

  const handleSearchValue = (value) => {
    const _value = value.replace(/\d+/g, "");
    setSearchBoxValue(_value);
  };

  const handleSearching = async () => {
    let query = "";

    if (searchBoxValue === "") {
      query = "rice chicken potato beef egg fish pork lamb goat turkey duck";
    } else {
      query = searchBoxValue;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/mainTable/modals/foodTable",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
          }),
        }
      );

      if (response.ok) {
        const _data = await response.json();

        if (_data.status === 201) {
          setData(_data.data);
          setIsLoading(false);
        } else {
          console.log("Fatal Error;");
        }
        //console.log(data[0].calories);
      }
      console.log(data);
    } catch (error) {
      console.error("catch block executed, Error:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      handleSearching();
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchBoxValue]);

  const handleChart = (item) => {
    console.log(item);

    for (let i = 0; i < data.length; i++) {
      if (data[i].name === item) {
        setSelectedRow(item);
        setProteinsChart(data[i].protein_g);
        setCarbsChart(data[i].carbohydrates_total_g);
        setFatsChart(data[i].fat_total_g);
      }
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        variant="light"
        color="success"
        className="end text-lg font-medium"
      >
        ADD FOOD
      </Button>

      <Modal
        backdrop="blur"
        scrollBehavior={"outside"}
        placement="top"
        size={"3xl"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-0 text-success-500">
                ADD FOOD
              </ModalHeader>

              <ModalBody>
                <Input
                  onChange={(e) => handleSearchValue(e.target.value)}
                  placeholder="Search all foods & ingredients & recipes..."
                  startContent={
                    <Image
                      src="/brotrition_assets/svg/search_logo.svg"
                      width="0"
                      height="0"
                      alt="search logo"
                      className="w-5 h-auto"
                    />
                  }
                  endContent={
                    <Button
                      onPress={handleSearching}
                      color="default"
                      variant=""
                      className="rounded-none border-l-2 border-l-slate-300 text-sm font-medium"
                    >
                      Search
                    </Button>
                  }
                  className="border-gray-300 border-2 rounded-xl"
                ></Input>

                <Table
                  //isStriped

                  selectionMode="single"
                  onRowAction={(row) => handleChart(row)}
                  color="success"
                  aria-label="Chose an aliment to add to your meal."
                  classNames={{
                    base: "max-h-[225px] overflow-scroll",
                  }}
                  className="w-full border-gray-300 border-2 rounded-2xl font-medium scrollbar-hide"
                >
                  <TableHeader>
                    <TableColumn key="name">Name</TableColumn>
                    <TableColumn key="macro">
                      Proteins/Carbs/Fats/100g
                    </TableColumn>
                    <TableColumn key="calories">Calories/100g</TableColumn>
                  </TableHeader>

                  <TableBody
                    loadingContent={<Spinner color="success" size="lg" />}
                    isLoading={isLoading}
                    emptyContent={"No such food exist."}
                    items={data}
                  >
                    {(item) => (
                      <TableRow key={item.name}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          {item.protein_g}/{item.fat_total_g}/
                          {item.carbohydrates_total_g}
                        </TableCell>
                        <TableCell>{item.calories}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <div className="border-gray-300 border-2 rounded-2xl p-3">
                  <h1 className="flex-center mb-5 text-lg font-medium">
                    {selectedRow.toUpperCase()}
                  </h1>
                  <div className="grid grid-cols-2 mb-3 content-center">
                    <div>
                      <Pie
                        className="min-w-fit w-32 max-w-fit ml-8 max-h-36"
                        data={data_chart}
                      />
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-5 text-sm">
                      <p>
                        Proteins: {proteinsChart}g{" ("}
                        <span className="font-bold text-[#1cc961]">10%</span>)
                      </p>
                      <p>
                        Carbs: {carbsChart}g{" ("}
                        <span className="font-bold text-[#13cedb]">12%</span>)
                      </p>
                      <p>
                        Fats: {fatsChart}g{" ("}
                        <span className="font-bold text-[#ec6737]">14%</span>)
                      </p>
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="success" onPress={onClose}>
                  Add food
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddFoodButton;
