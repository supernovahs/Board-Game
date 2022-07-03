import React from 'react'
import {
    Box, Text, Input, Button, useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormLabel,
    FormControl,
    Textarea,
} from '@chakra-ui/react'

const EventCard = ({ opponent, attackx, attacky, setattackx, setattacky, setattackaddress, attack }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Box mt={3} bg={'gray.300'} border={'1px solid black'} borderRadius={10} p={5}>
            <Text>
                <Input value={(opponent?.address)} contentEditable={false} />
            </Text>
            <Text mt={2}>Health: {Number(opponent?.health)}</Text>
            <Text mt={2}>Zone: {Number(opponent?.zone)}</Text>
            <Button onClick={() => {
                setattackaddress(opponent?.address)
                onOpen()
            }} mt={2} colorScheme={'red'}>Attack</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Address: {String(opponent?.address).substring(0, 10)}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <FormControl>
                            <FormLabel>X Coordinate to Attack</FormLabel>
                            <Input type={'number'} value={attackx} onChange={(e) => setattackx(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Y Coordinate to Attack</FormLabel>
                            <Input type={'number'} value={attacky} onChange={(e) => setattacky(e.target.value)} />
                        </FormControl>


                    </ModalBody>


                    <ModalFooter>
                        <Button
                            onClick={async () => {
                                const res = await attack()
                            }}
                            colorScheme='red' mr={3}>
                            Attack
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default EventCard