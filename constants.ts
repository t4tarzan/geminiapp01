import type { Lesson } from './types';
import { Grade, Subject } from './types';

export const GRADES = Object.values(Grade);
export const SUBJECTS = Object.values(Subject);

export const LESSONS: Lesson[] = [
  // Grade 5 - Science
  {
    id: 1,
    grade: Grade.GRADE_5,
    subject: Subject.SCIENCE,
    title: 'Introduction to the Solar System',
    videoId: 'z_K-a-2-58A',
    transcript: `Learn about the vastness of our solar system, centered around the Sun. We'll explore the eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune, and understand their order and key features. We'll also touch upon other celestial bodies like dwarf planets and asteroid belts.`,
  },
  {
    id: 2,
    grade: Grade.GRADE_5,
    subject: Subject.SCIENCE,
    title: 'The Water Cycle Explained',
    videoId: 'z2x-k5g_434',
    transcript: `Discover how water moves around our planet in a continuous cycle. This lesson covers the main stages: evaporation, where water turns into vapor; condensation, forming clouds; precipitation, where water falls back to Earth as rain or snow; and collection in rivers, lakes, and oceans.`,
  },
  // Grade 5 - Math
  {
    id: 6,
    grade: Grade.GRADE_5,
    subject: Subject.MATH,
    title: 'Introduction to Decimals',
    videoId: 'n6-c_p-b64M',
    transcript: `This video introduces decimals as a way to represent parts of a whole number. You'll learn about the decimal point, and the place values to its right, such as tenths and hundredths. We'll see how decimals relate to fractions and how to read them.`,
  },
  {
    id: 7,
    grade: Grade.GRADE_5,
    subject: Subject.MATH,
    title: 'Multiplication as Repeated Addition',
    videoId: 's-K2t_grA8',
    transcript: `Understand the fundamental concept of multiplication as a shortcut for repeated addition. For example, 4 times 3 is the same as adding 4 three times. This lesson builds a strong foundation for multiplication skills.`,
  },
  // Grade 5 - History
  {
    id: 8,
    grade: Grade.GRADE_5,
    subject: Subject.HISTORY,
    title: 'Pilgrims and Wampanoag Alliance',
    videoId: 'p3h04fWc5-Y',
    transcript: `Explore the historical context of the first Thanksgiving. Learn about the Pilgrims who arrived in North America on the Mayflower and the Wampanoag people who lived there. This video discusses their interactions, the alliance they formed, and the shared harvest feast.`,
  },
  {
    id: 9,
    grade: Grade.GRADE_5,
    subject: Subject.HISTORY,
    title: 'Meet the Vikings!',
    videoId: 'fS5Xl5A-16I',
    transcript: `Journey back in time to learn about the Vikings, the seafaring people from Scandinavia. Discover their culture, their skills as sailors and explorers, and their impact on history, including their voyages to distant lands like North America.`,
  },
  // Grade 6 - Science
  {
    id: 10,
    grade: Grade.GRADE_6,
    subject: Subject.SCIENCE,
    title: 'Introduction to Ecosystems',
    videoId: 'O388d-s-v_4',
    transcript: `What is an ecosystem? This video explains how living organisms (like plants and animals) and non-living components (like sun, water, and soil) interact with each other. Learn about producers, consumers, and decomposers and the flow of energy in an ecosystem.`,
  },
  {
    id: 11,
    grade: Grade.GRADE_6,
    subject: Subject.SCIENCE,
    title: 'Introduction to Simple Machines',
    videoId: 'W1K45_gLhM4',
    transcript: `Discover the six classical simple machines that have been used for thousands of years to make work easier. This lesson covers the lever, wheel and axle, pulley, inclined plane, wedge, and screw, with examples of how they work in everyday life.`,
  },
  // Grade 6 - Math
  {
    id: 3,
    grade: Grade.GRADE_6,
    subject: Subject.MATH,
    title: 'What are Fractions?',
    videoId: '2k_p23-4w8',
    transcript: `A fraction is a number that represents a part of a whole. This introduction covers the basics of fractions, including the numerator (the top number) and the denominator (the bottom number), and what they represent in real-world examples.`,
  },
  {
    id: 12,
    grade: Grade.GRADE_6,
    subject: Subject.MATH,
    title: 'Introduction to Ratios',
    videoId: '_c4qjS0Y2M',
    transcript: `Learn how to use ratios to compare two different quantities. This video explains how to write ratios in different ways (like 'a to b' or a:b) and how to simplify them. Understand the relationship between ratios, fractions, and real-world scenarios.`,
  },
  // Grade 6 - History
  {
    id: 13,
    grade: Grade.GRADE_6,
    subject: Subject.HISTORY,
    title: 'The Roman Republic',
    videoId: '7-y_14Q6oM4',
    transcript: `Discover the foundations of ancient Rome by learning about the Roman Republic. Explore its system of government with senators and consuls, its social structure, and the events that led to its expansion and eventual transformation into the Roman Empire.`,
  },
  {
    id: 14,
    grade: Grade.GRADE_6,
    subject: Subject.HISTORY,
    title: 'Overview of the Middle Ages',
    videoId: 'QV7C41p4-8I',
    transcript: `Get a broad overview of the Middle Ages in Europe, the period between the fall of Rome and the Renaissance. Learn about feudalism, the role of knights, the importance of the church, and key events that shaped this era.`,
  },
  // Grade 7 - Science
  {
    id: 15,
    grade: Grade.GRADE_7,
    subject: Subject.SCIENCE,
    title: 'Plant Cells',
    videoId: '9UvlqAVCoqY',
    transcript: `Take a microscopic journey inside a plant cell. This lesson details the various organelles and their functions, such as the nucleus, chloroplasts for photosynthesis, and the rigid cell wall that provides structure. Compare plant cells to animal cells to understand their unique features.`,
  },
  {
    id: 16,
    grade: Grade.GRADE_7,
    subject: Subject.SCIENCE,
    title: 'Newton\'s Laws of Motion',
    videoId: 'kKKM8Y-u7ds',
    transcript: `Explore Sir Isaac Newton's three fundamental laws of motion. The video explains inertia (first law), the relationship between force, mass, and acceleration (F=ma, second law), and the concept of action and reaction (third law) with clear examples.`,
  },
  // Grade 7 - Math
  {
    id: 17,
    grade: Grade.GRADE_7,
    subject: Subject.MATH,
    title: 'What is Algebra?',
    videoId: 'NybHckSEQBI',
    transcript: `Algebra is a powerful tool in mathematics that uses variables (like x or y) to solve problems. This introduction explains the basic concepts of algebra, including how to work with expressions and solve simple equations to find unknown values.`,
  },
  {
    id: 18,
    grade: Grade.GRADE_7,
    subject: Subject.MATH,
    title: 'What are Percentages?',
    videoId: 'U35g_Ca68yY',
    transcript: `Learn the meaning of 'percent' as 'per hundred.' This video breaks down how to convert between percentages, decimals, and fractions. Understand how to calculate percentages of numbers and apply this skill to real-world problems like discounts and tips.`,
  },
  // Grade 7 - History
  {
    id: 4,
    grade: Grade.GRADE_7,
    subject: Subject.HISTORY,
    title: 'Ancient Egypt',
    videoId: 'Z3Wuwg5v4aI',
    transcript: `Explore the civilization of ancient Egypt that flourished along the Nile River. Learn about pharaohs, the construction of the great pyramids at Giza, their religious beliefs about the afterlife, and the practice of mummification.`,
  },
  {
    id: 19,
    grade: Grade.GRADE_7,
    subject: Subject.HISTORY,
    title: 'The Silk Road',
    videoId: 'vfe-eNq-Qyg',
    transcript: `Discover the ancient network of trade routes known as the Silk Road, which connected the East and West. This video explains how it facilitated the exchange of not only goods like silk and spices but also cultures, ideas, and technologies between civilizations.`,
  },
  // Grade 8 - Science
  {
    id: 20,
    grade: Grade.GRADE_8,
    subject: Subject.SCIENCE,
    title: 'Introduction to Chemistry',
    videoId: 'bka20Q9TN6M',
    transcript: `Chemistry is the science of matter. This video introduces the basic building blocks of matter: atoms and molecules. Learn about elements, the periodic table, and how atoms combine to form the substances all around us.`,
  },
  {
    id: 21,
    grade: Grade.GRADE_8,
    subject: Subject.SCIENCE,
    title: 'Plate Tectonics Overview',
    videoId: 'tcPghqnnTVk',
    transcript: `Learn about the theory of plate tectonics, which explains how the Earth's surface is broken into large, moving plates. This video covers the different types of plate boundaries and how their movements cause earthquakes, volcanoes, and mountain formation.`,
  },
  // Grade 8 - Math
  {
    id: 5,
    grade: Grade.GRADE_8,
    subject: Subject.MATH,
    title: 'Intro to the Pythagorean Theorem',
    videoId: 'AA6RfgP-AHU',
    transcript: `The Pythagorean theorem relates the three sides of a right-angled triangle. This lesson explains the formula a² + b² = c² and shows how to use it to find the length of a missing side. It's a fundamental concept in geometry.`,
  },
  {
    id: 22,
    grade: Grade.GRADE_8,
    subject: Subject.MATH,
    title: 'Solving Simple Equations',
    videoId: 'Q-a_s-_yKQE',
    transcript: `This video introduces the foundational principle of solving algebraic equations: whatever you do to one side of the equation, you must do to the other. Learn how to use addition, subtraction, multiplication, and division to isolate the variable and find its value.`,
  },
  // Grade 8 - History
  {
    id: 23,
    grade: Grade.GRADE_8,
    subject: Subject.HISTORY,
    title: 'Prelude to the American Revolution',
    videoId: 'L4dI8-B-3I0',
    transcript: `Explore the key events and ideas that led to the American Revolution. This video covers the growing tensions between Great Britain and its thirteen American colonies, focusing on issues like taxation without representation and acts like the Stamp Act.`,
  },
  {
    id: 24,
    grade: Grade.GRADE_8,
    subject: Subject.HISTORY,
    title: 'The Industrial Revolution',
    videoId: 'xLhNP0qp38Q',
    transcript: `Discover the major technological, socioeconomic, and cultural changes of the Industrial Revolution. Learn about the shift from an agrarian society to an industrial one, the rise of factories, and key inventions like the steam engine that transformed the world.`,
  },
];