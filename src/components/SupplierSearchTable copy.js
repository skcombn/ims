import React, { useState, useEffect } from 'react';

import {
  Box,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  //ModalHeader,
  //ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import CustomDataTable from '../helpers/CustomDataTable';
import { useRecoilState } from 'recoil';
import { searchitemState } from '../data/atomdata';
import { useSuppliers } from '../react-query/suppliers/useSuppliers';
//import ItemForm from './ItemForm';

const initial_supp = {
  s_suppno: '',
  s_supp: '',
  s_add1: '',
  s_add2: '',
  s_add3: '',
  s_add4: '',
  s_phone: '',
  s_email: '',
  s_fax: '',
  s_contact: '',
  s_area: '',
};

const SupplierSearchTable = ({ update_Item, onSupplierSearchClose }) => {
  const { suppliers } = useSuppliers();
  const [data, setData] = useState(suppliers);
  const [filterText, setFilterText] = React.useState('');
  const [searchitem, setSearchItem] = useRecoilState(searchitemState);
  const titles = 'Supplier Search Table';

  const filteredData = suppliers
    .filter(
      item =>
        item.s_supp &&
        item.s_supp.toLowerCase().includes(filterText.toLowerCase())
    )
 

  console.log('filterdata', filteredData);

  const columns = [
    // {
    //   id: 1,
    //   key: 'addaction',
    //   text: 'Action',
    //   align: 'center',
    //   sortable: false,
    //   width: '60px',

    //   cell: record => {
    //     return (
    //       <>
    //         <IconButton
    //           size="sm"
    //           icon={<AiOutlinePlus />}
    //           onClick={() => {
    //             handleAddCust(record);
    //           }}
    //         ></IconButton>
    //       </>
    //     );
    //   },
    // },
    // {
    //   id: 2,
    //   key: 'editaction',
    //   text: 'Action',
    //   sortable: false,
    //   width: '60px',
    //   cell: record => {
    //     return (
    //       <>
    //         <IconButton
    //           icon={<AiFillEdit />}
    //           size="sm"
    //           onClick={() => {
    //             handleEditCust(record);
    //           }}
    //         ></IconButton>
    //       </>
    //     );
    //   },
    // },
    // {
    //   id: 3,
    //   key: 'deleteaction',
    //   text: 'Action',
    //   width: '60px',
    //   sortable: false,
    //   cell: record => {
    //     return (
    //       <>
    //         <IconButton
    //           icon={<AiFillDelete />}
    //           size="sm"
    //           onClick={() => {
    //             handleDeleteCust(record);
    //           }}
    //         />
    //       </>
    //     );
    //   },
    // },
    {
      id: 4,
      name: 'Supp No',
      selector: row => row.s_suppno,
      sortable: true,
      filterable: true,
      width: '120px',
    },
    {
      id: 5,
      name: 'Supplier',
      selector: row => row.s_supp,
      width: '200px',
      sortable: true,
      filterable: true,
      align: 'left',
      wrap: false,
      cell: row => (
        <div style={{ overflow: 'hidden', textAlign: 'left' }}>
          {row.s_supp}
        </div>
      ),
    },
    // {
    //   id: 6,
    //   name: 'Address Line 1',
    //   selector: row => row.c_add1,
    //   //selector: row => row.ar_add1,
    //   //wrap: true,
    //   width: '200px',
    //   //grow: 4,
    //   cell: row => (
    //     <div
    //       style={{
    //         color: 'grey',
    //         overflow: 'hidden',
    //         whiteSpace: 'wrap',
    //         textOverflow: 'ellipses',
    //         textAlign: 'left',
    //       }}
    //     >
    //       {row.ar_add1}
    //     </div>
    //   ),
    // },
    // {
    //   id: 7,
    //   name: 'Address Line 2',
    //   selector: row => row.ar_add2,
    //   wrap: true,
    //   minWidth: '200px',
    //   //align: 'left',
    //   left: true,
    //   grow: 4,
    //   cell: row => (
    //     <div
    //       style={{
    //         color: 'grey',
    //         overflow: 'hidden',
    //         whiteSpace: 'wrap',
    //         textOverflow: 'ellipses',
    //         textAlign: 'left',
    //       }}
    //     >
    //       {row.ar_add2}
    //     </div>
    //   ),
    // },
    // {
    //   id: 8,
    //   name: 'Address Line 3',
    //   selector: row => row.ar_add3,
    //   wrap: true,
    //   minWidth: '200px',
    //   //align: 'left',
    //   left: true,
    //   grow: 4,
    //   cell: row => (
    //     <div
    //       style={{
    //         color: 'grey',
    //         overflow: 'hidden',
    //         whiteSpace: 'wrap',
    //         textOverflow: 'ellipses',
    //         textAlign: 'left',
    //       }}
    //     >
    //       {row.ar_add3}
    //     </div>
    //   ),
    // },
    {
      id: 9,
      name: 'Phone',
      selector: row => row.s_phone,
      width: '120px',
    },
    {
      id: 10,
      name: 'Email',
      selector: row => row.s_email,
      width: '120px',
    },
    {
      id: 11,
      name: 'Fax',
      selector: row => row.s_fax,
      width: '120px',
    },
    // {
    //   id: 12,
    //   name: 'Contact',
    //   sortable: true,
    //   selector: row => row.s_contact,
    //   width: '120px',
    //   cell: row => (
    //     <div style={{ overflow: 'hidden', textAlign: 'left' }}>
    //       {row.s_contact}
    //     </div>
    //   ),
    // },
    // {
    //   id: 13,
    //   name: 'Toggle',
    //   sortable: true,
    //   selector: row => row.toggleSelected,
    //   width: '120px',
    //   cell: row => {
    //     switch (row.toggleSelected) {
    //       case true:
    //         return <div>True</div>;
    //       case false:
    //         return <div>False</div>;

    //       default:
    //         return null;
    //     }
    //   },
    // },
  ];

  const handleRowDoubleClick = e => {
    setSearchItem(prev => (prev = e));
    update_Item(e);
    onSupplierSearchClose();
  };

  const handleRowClick = row => {
    // const updatedData = batchdetls.map(item => {
    //   if (row.qd_id !== item.qd_id) {
    //     return {
    //       ...item,
    //       toggleSelected: false,
    //     };
    //   }
    //   setDetlsSelectedId(prev => (prev = item.qd_itemno));
    //   return {
    //     ...item,
    //     toggleSelected: !item.toggleSelected,
    //   };
    // });

    // setBatchdetls(updatedData);
  };

  const handleSelectRec = e => {
    update_Item(searchitem);
    onSupplierSearchClose();
  };

  return (
    <Flex>
      <Box
        width="100%"
        borderWidth={1}
        borderColor="teal.800"
        borderRadius={10}
        overflow="scroll"
      >
        <CustomDataTable
          title={titles}
          columns={columns}
          filteredData={filteredData}
          //handleAddRec={handleAddItem}
          filterText={filterText}
          setFilterText={setFilterText}
          hideAddRec={true}
          hideSelectRec={false}
          handleSelectRec={handleSelectRec}
          handleRowDoubleClick={handleRowDoubleClick}
          handleRowClick={handleRowClick}
          //handleRowChange={handleRowChange}
          defaultSortAsc={true}
          defaultSortFieldId="5"
        />
      </Box>
    </Flex>
  );
};

export default SupplierSearchTable;
