/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { Accordion, AccordionItem, Badge, Button, Card, CardBody, CardFooter, CardHeader, Divider, Image, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Selection, Tooltip, useDisclosure } from '@nextui-org/react';
import { BellIcon, CrumpledPaperIcon, LightningBoltIcon, PlusIcon, ResetIcon, RocketIcon, TrashIcon } from '@radix-ui/react-icons';
// pages/index.tsx
import { useEffect, useState } from 'react';

interface Habit {
  id: number;
  title: string;
  days: string[];
  priority: string;
  completed: Record<string, boolean>; // Map to store completion status for each day
}

function sortHabitsByPriority(habits: Habit[]): Habit[] {
  const sortedHabits = habits.sort((a, b) => {
    return a.priority.localeCompare(b.priority);
  });
  return sortedHabits;
}

const Days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
function sortDays(randomDays: any[]): any[] {
  const sortedDays = randomDays.sort((a: any, b: any) => Days.indexOf(a) - Days.indexOf(b));
  return sortedDays;
}

const HabitTracker = () => {
  if (!global?.window) return null;

  const [habits, setHabits] = useState<Habit[]>(window.localStorage.getItem('habit-tracker-app') != undefined ? JSON.parse(String(window.localStorage.getItem('habit-tracker-app'))) : []);
  const [habitTitle, setHabitTitle] = useState('');
  const [habitDays, setHabitDays] = useState<any[]>([]);
  const [habitDaysSet, setHabitDaysSet] = useState<Selection>(new Set([]));
  const [habitPriority, setHabitPriority] = useState('');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const addHabit = () => {
    if (!habitTitle || habitDays.length === 0 || !habitPriority) return;

    const newHabit: Habit = {
      id: Date.now(),
      title: habitTitle,
      days: sortDays(habitDays),
      priority: (Number(habitPriority) > 4) ? '4' : habitPriority,
      completed: {},
    };

    setHabits((prevHabits) => [...prevHabits, newHabit]);
    window.localStorage.setItem('habit-tracker-app', JSON.stringify([...habits, newHabit]))
    setHabitTitle('');
    setHabitDays([]);
    setHabitDaysSet(new Set())
    setHabitPriority('');
  };

  const toggleCompletion = (habitId: number, day: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId
          ? {
            ...habit,
            completed: {
              ...habit.completed,
              [day]: !habit.completed[day],
            },
          }
          : habit
      )
    );
  };

  const deleteHabit = (id: number) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
  };

  function resetCompletedDays(habitId: number) {
    const updatedHabits = habits.map((habit) =>
      habit.id === habitId ? { ...habit, completed: {} } : habit
    );
    setHabits(updatedHabits);
  }

  const completedTasksCount = habits.reduce((count, habit) => {
    Object.values(habit.completed).forEach((isCompleted) => {
      if (isCompleted) {
        count.completed++;
      } else {
        count.notCompleted++;
      }
    });
    return count;
  }, { completed: 0, notCompleted: 0 });

  useEffect(() => {
    setHabitDays(sortDays(Array.from(habitDaysSet)))
  }, [habitDaysSet])

  // Update local storage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem('habit-tracker-app', JSON.stringify(habits));
  }, [habits]);

  return (

    <div className='w-screen h-screen flex items-center justify-center py-2 md:p-10 2xl:p-20 overflow-x-hidden text-sm md:text-base'>
      <div className='p-2 pb-8 w-full xl:4/5 2xl:w-3/5 h-full'>
        <Card className="w-full">
          <CardHeader className="flex gap-3">
            <Image
              alt="Habit Tracker Logo"
              height={40}
              radius="sm"
              src="https://avatars.githubusercontent.com/u/91818906?s=400&u=6e1018587b8c64e66afb1456061b5638eab86fe0&v=4"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md">Habit Tracker</p>
              <p className="text-xs md:text-small text-default-500">
                Made by
                <Link
                  className='mx-1 text-xs md:text-small'
                  isExternal
                  showAnchorIcon
                  href="https://github.com/Abubakersiddique761"
                >
                  Abubakersiddique761
                </Link></p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-small text-default-500">Total Habits: <strong>{habits.length}</strong></p>
            <p className="text-small text-default-500">Today: <strong>{Days[new Date().getDay() - 1]}</strong></p>
            {/* <p className="text-small text-default-500">Remaining Tasks: <strong>{completedTasksCount.notCompleted}</strong></p>
            <p className="text-small text-default-500">Completed: <strong>{completedTasksCount.completed}</strong></p> */}
          </CardBody>
        </Card>
        <div className='mt-2 sm:columns-2 md:columns-3 lg:columns-4 gap-2'>
          {sortHabitsByPriority(habits).map((habit) => (
            <Card className="w-full mb-2 group" key={habit.id}>
              <CardHeader className="flex flex-col items-start gap-1">
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-start gap-3'>
                    <Badge content="" color="success" isInvisible={
                      habit.days.includes(Days[new Date().getDay() - 1]) && !habit.completed[Days[new Date().getDay() - 1]] ?
                        false
                        :
                        true
                    }>
                      {
                        habit.priority == '1' && (
                          <Button color='danger' isIconOnly disabled variant={
                            habit.days.includes(Days[new Date().getDay() - 1]) && !habit.completed[Days[new Date().getDay() - 1]] ?
                              habit.days.includes(Days[new Date().getDay() - 1]) && habit.completed[Days[new Date().getDay() - 1]] ?
                                'bordered'
                                :
                                'solid'
                              :
                              'flat'
                          }>
                            <RocketIcon />
                          </Button>
                        )
                      }
                      {
                        habit.priority == '2' && (
                          <Button color='warning' isIconOnly disabled variant={
                            habit.days.includes(Days[new Date().getDay() - 1]) && !habit.completed[Days[new Date().getDay() - 1]] ?
                              habit.days.includes(Days[new Date().getDay() - 1]) && habit.completed[Days[new Date().getDay() - 1]] ?
                                'bordered'
                                :
                                'solid'
                              :
                              'flat'
                          }>
                            <LightningBoltIcon />
                          </Button>
                        )
                      }
                      {
                        habit.priority == '3' && (
                          <Button color='primary' isIconOnly disabled variant={
                            habit.days.includes(Days[new Date().getDay() - 1]) && !habit.completed[Days[new Date().getDay() - 1]] ?
                              habit.days.includes(Days[new Date().getDay() - 1]) && habit.completed[Days[new Date().getDay() - 1]] ?
                                'bordered'
                                :
                                'solid'
                              :
                              'flat'
                          }>
                            <BellIcon />
                          </Button>
                        )
                      }
                      {
                        habit.priority == '4' && (
                          <Button color='default' isIconOnly disabled variant={
                            habit.days.includes(Days[new Date().getDay() - 1]) && !habit.completed[Days[new Date().getDay() - 1]] ?
                              habit.days.includes(Days[new Date().getDay() - 1]) && habit.completed[Days[new Date().getDay() - 1]] ?
                                'bordered'
                                :
                                'solid'
                              :
                              'flat'
                          }>
                            <CrumpledPaperIcon />
                          </Button>
                        )
                      }
                    </Badge>
                    <div className="flex flex-col">
                      <p className="text-md">{habit.title}</p>
                      <p className="text-small text-default-500">Priority: {habit.priority}</p>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <Tooltip content="Reset Days">
                      <Button color='warning' isIconOnly variant='flat' size='sm' className='md:hidden md:group-hover:flex' onClick={() => resetCompletedDays(habit.id)}><ResetIcon /></Button>
                    </Tooltip>
                    <Tooltip content="Delete Habit">
                      <Button color='danger' isIconOnly variant='flat' size='sm' className='md:hidden md:group-hover:flex' onClick={() => deleteHabit(habit.id)}><TrashIcon /></Button>
                    </Tooltip>
                  </div>
                </div>
                <p className="text-small text-default-500">Total Days: {habit.days.length}</p>
                {
                  habit.days.includes(Days[new Date().getDay() - 1]) && !habit.completed[Days[new Date().getDay() - 1]] && (
                    <strong className="text-small">You have an task to finish.</strong>
                  )
                }
                {
                  habit.days.includes(Days[new Date().getDay() - 1]) && habit.completed[Days[new Date().getDay() - 1]] && (
                    <strong className="text-small text-success">Today&apos;s task is finished.</strong>
                  )
                }
              </CardHeader>
              <div className='p-3 pt-0'>
                <div className='grid grid-cols-4 gap-2'>
                  {habit.days.map((day) => (
                    <Button
                      key={day}
                      variant={
                        Days[new Date().getDay() - 1] == day ?
                          habit.completed[day] ?
                            'flat'
                            :
                            'solid'
                          :
                          habit.completed[day] ?
                            'flat'
                            :
                            'bordered'
                      }
                      onClick={() => toggleCompletion(habit.id, day)}
                      size='sm'
                      color={'success'}
                    >
                      {
                        habit.completed[day] ?
                          <span className='line-through'>{String(day).slice(0, 3)}</span>
                          :
                          String(day).slice(0, 3)
                      }
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className='pb-8'>
          <Accordion className='mt-2 p-0' variant='splitted'>
            <AccordionItem key="1" className='p-0' aria-label="New Task" title="New Task" indicator={<PlusIcon />}>
              <div className='flex flex-col lg:flex-row justify-between items-center lg:space-x-2'>
                <Input type='text' label="Habit Title" size='sm' className='w-full' description={"Make sure it's your precise habit."} value={habitTitle} onValueChange={(value) => setHabitTitle(value)} />
                <Select selectionMode='multiple' label="Days" size='sm' className="w-full" description={"Mention the days to align this habit."} selectedKeys={habitDaysSet} onSelectionChange={setHabitDaysSet} >
                  <SelectItem key={"Sunday"} value={"Sunday"}>Sunday</SelectItem>
                  <SelectItem key={"Monday"} value={"Monday"}>Monday</SelectItem>
                  <SelectItem key={"Tuesday"} value={"Tuesday"}>Tuesday</SelectItem>
                  <SelectItem key={"Wednesday"} value={"Wednesday"}>Wednesday</SelectItem>
                  <SelectItem key={"Thursday"} value={"Thursday"}>Thursday</SelectItem>
                  <SelectItem key={"Friday"} value={"Friday"}>Friday</SelectItem>
                  <SelectItem key={"Saturday"} value={"Saturday"}>Saturday</SelectItem>
                </Select>
                <Input type='number' min={1} max={4} label="Priority" size='sm' className='w-full' description={"Priority ranges from 1 to 4, don't exceed this limit."} value={habitPriority} onValueChange={(value) => setHabitPriority(value)} />
              </div>
              <div className='flex items-center justify-start pb-4'>
                <Button color='primary' onClick={addHabit} isDisabled={habitTitle && habitDays && habitPriority ? false : true}>
                  Add Habit
                </Button>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div >
  );
};

export default HabitTracker;
