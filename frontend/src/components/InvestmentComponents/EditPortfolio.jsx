import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import classes from "./EditPortfolio.module.css";

export default function EditPortfolio(props) {
  const [activeTab, setActiveTab] = useState("equities");
  const [selectedItem, setSelectedItem] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const renderEquities = () => {
    const { equities } = props.data;
    if (!equities || equities.length === 0) {
      return <div>No equities data available.</div>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Ticker</th>
            <th>Buy Price</th>
            <th>Current Price</th>
            <th>P&amp;L</th>
          </tr>
        </thead>
        <tbody>
          {equities.map((equity, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItem === equity}
                  onChange={() => handleItemClick(equity)}
                />
              </td>
              <td>{equity.equity_ticker}</td>
              <td>{equity.equity_buy_price}</td>
              <td>{equity.equity_current_price}</td>
              <td>
                {parseFloat(equity.equity_pnl.replace("%", "")).toFixed(1) +
                  "%"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderOptions = () => {
    const { options } = props.data;
    if (!options || options.length === 0) {
      return <div>No options data available.</div>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Ticker</th>
            <th>Option Type</th>
            <th>Current Price</th>
            <th>Strike Price</th>
            <th>Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItem === option}
                  onChange={() => handleItemClick(option)}
                />
              </td>
              <td>{option.derivative_ticker || "NA"}</td>
              <td>{option.option_type || "NA"}</td>
              <td>{option.derivative_current_price || "NA"}</td>
              <td>{option.strike_price || "NA"}</td>
              <td>{option.expiration_date.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      <Button
        onClick={onOpen}
        w="175px"
        h="71px"
        borderRadius="50"
        color="white"
        bg="#3f2371"
        float="right"
      >
        Edit
      </Button>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="30px">
            Edit Portfolio Data
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <div>
            <button
              onClick={() => handleTabClick("equities")}
              className={
                activeTab === "equities" ? classes.activeTab : classes.tab
              }
            >
              Equities
            </button>
            <button
              onClick={() => handleTabClick("options")}
              className={
                activeTab === "options" ? classes.activeTab : classes.tab
              }
            >
              Options
            </button>
          </div>
          {activeTab === "equities" && renderEquities()}
          {activeTab === "options" && renderOptions()}
          <ModalFooter>
            <Button onClick={onClose} colorScheme="yellow" pl="20px">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
