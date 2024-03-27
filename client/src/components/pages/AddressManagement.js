import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify';



function AddressManagement() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null); // Track selected address index
  const [activeTab, setActiveTab] = useState('list'); // Manage active tab ('list' or 'selected')
  const [newAddress, setNewAddress] = useState('');
  const [primaryAddress,setPrimaryAddress] = useState([])
  const [primaryAddressIndex, setPrimaryAddressIndex] = useState(null);

  useEffect(() => {
    // Fetch user's address data when the component mounts
    const fetchUserAddresses = async () => {
      try {
        const response = await axios.get('/api/v1/addresses');
        setAddresses(response.data.addresses);
        const primary = response.data.addresses.find(address => address.isPrimary);
        console.log(primary,"hi prim")
        if (primary) {
          setPrimaryAddress(primary.address);
          const index = response.data.addresses.findIndex(address => address.isPrimary);
          setPrimaryAddressIndex(index);
        }
      } catch (error) {
        console.error('Error fetching user addresses:', error);
      }
    };

    fetchUserAddresses(); 
  
    // Call the function
  }, []); 

 

  const handleAddressSelect = (index) => {
    setSelectedAddressIndex(index);
    setActiveTab('selected');
  };

  const handleAddressDelete = async() => {
    // Implement logic to delete address at selectedIndex
    if(selectedAddressIndex !== primaryAddressIndex){ 

      const addressIdToDelete = addresses[selectedAddressIndex]._id;
      await axios.delete(`/api/v1/${addressIdToDelete}`);
      const updatedAddresses = addresses.filter((_, index) => index !== selectedAddressIndex);
      setAddresses(updatedAddresses);
      setSelectedAddressIndex(null);
      setActiveTab('list');
    }
  };

  const handlePrimarySelect = async(index) => {
    const addressId = addresses[index]._id; // Get the address ID to set as primary
    await axios.put(`/api/v1/${addressId}/primary`);
    setPrimaryAddressIndex(index);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleAddAddress = async() => {
    try {
      const response = await axios.post('/api/v1/addresses', {
        address: newAddress,
        isPrimary: false // Set isPrimary to false for new address
      });
      const newUser = response.data.user;
      setAddresses([...addresses, newUser.addresses[newUser.addresses.length - 1]]);
      setNewAddress('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
    }
    else{
      toast.error('Address update failed.');
    }
    }
  };

  return (
    <div className="address-management">
      {/* Tab Navigation */}
      <ul className="flex space-x-4 border-b border-gray-300 pb-2 mb-4">
        <li
          className={`py-2 px-4 cursor-pointer ${
            activeTab === 'list' ? 'border-b-2 border-blue-500 text-blue-500 font-semibold' : ''
          }`}
          onClick={() => handleTabClick('list')}
        >
          Address List
        </li>
        <li
          className={`py-2 px-4 cursor-pointer ${
            activeTab === 'selected' ? 'border-b-2 border-blue-500 text-blue-500 font-semibold' : ''
          }`}
          onClick={() => handleTabClick('selected')}
        >
          Selected Address
        </li>
      </ul>

      {/* Address List Tab */}
      {activeTab === 'list' && (
        <div>
          <div>
          {addresses.map((addressData, index) => (
   <div key={index} className="flex justify-between items-center mb-2">
    <p>{addressData.address}</p> {/* Access the 'address' property of the addressData object */}
    <div className="flex space-x-2">
      <button
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
        onClick={() => handleAddressSelect(index)}
      >
        Select
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md"
        onClick={() => handlePrimarySelect(index)}
      >
        Set as Primary
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Address Tab */}
      {activeTab === 'selected' && selectedAddressIndex !== null && (
        <div>
          <p>{addresses[selectedAddressIndex].address}</p>
          <div className="flex space-x-2 mt-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleAddressDelete}
              disabled={selectedAddressIndex === primaryAddressIndex}
              >
              Delete
            </button>
          </div>
          <button
            className="text-blue-500 font-semibold mt-4 hover:underline"
            onClick={() => handleTabClick('list')}
          >
            Back to Address List
          </button>
        </div>
      )}

      {/* No Address Selected Message */}
      {activeTab === 'selected' && selectedAddressIndex === null && (
        <p className="text-gray-500 text-sm">No address selected.</p>
      )}

      {/* Add Address Form */}
      {activeTab === 'list' && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Add New Address</h2>
          <input
            type="text"
            className="border border-gray-300 px-4 py-2 rounded-md w-full mb-4"
            placeholder="Enter your address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleAddAddress}
          >
            Add Address
          </button>
        </div>
      )}

      {/* Primary Address */}
      {primaryAddressIndex !== null && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Primary Address</h2>
          <p>{addresses[primaryAddressIndex].address}</p>          
        </div>
      )}
    </div>
  );
}

export default AddressManagement;
