import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, ArrowLeft, ChevronDown, Code, FileText, TestTube2, Link2,Eye, EyeOff, HardHat, Tags } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from "react-router";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum(["graph", "linked-list", "stack", "queue", "array", "DP", "recursion"]),
  editorial: z.string().optional().or(z.literal('')),
  visibleTestCases: z.array(z.object({
    input: z.string(),
    output: z.string(),
    explanation: z.string()
  })),
  Hiddencases: z.array(z.object({
    input: z.string(),
    output: z.string()
  })),
  startCode: z.array(z.object({
    language: z.string(),
    initialCode: z.string()
  })),
  referenceSolution: z.array(z.object({
    language: z.string(),
    completeCode: z.string()
  }))
});

export default function CreateProblem() {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      tags: 'array',
      editorial:'',
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      Hiddencases: [{ input: '', output: '' }],
      startCode: [{ language: 'javascript', initialCode: '' }],
      referenceSolution: [{ language: 'javascript', completeCode: '' }]
    }
  });

  const navigate = useNavigate();
  const visibleFieldArray = useFieldArray({ control, name: 'visibleTestCases' });
  const hiddenFieldArray = useFieldArray({ control, name: 'Hiddencases' });
  const codeFieldArray = useFieldArray({ control, name: 'startCode' });
  const solutionFieldArray = useFieldArray({ control, name: 'referenceSolution' });

  const onSubmit = async (data) => {
    try{
        const create = await axiosClient.post("/problem/create",data);
        console.log(create.data);
        navigate('/admin')
    }catch(err){
        console.log(err.message)
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      <header className="bg-gray-900/50 shadow-sm p-4 flex justify-between items-center border-b border-gray-800 mb-5">
        <div 
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-colors" 
          onClick={() => navigate('/')}
        >
          <img 
            src="https://res.cloudinary.com/dsty8mkcl/image/upload/v1750091120/m6ninozwcarwvbtnt5bq.png" 
            alt="CodeStrike Logo" 
            className="h-8 w-8" 
          />
          <span className="text-xl font-bold text-white">CodeStrike</span>
        </div>

        <button 
          onClick={() => navigate("/admin")} 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900/20 hover:bg-blue-800/30 text-blue-400 border border-blue-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Dashboard</span>
        </button>
      </header>

      <div className="max-w-5xl mx-auto bg-[#111827] shadow-xl rounded-2xl p-6 sm:p-8 space-y-8 border border-gray-800">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-900/20 rounded-full">
            <Code size={28} className="text-blue-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Create Coding Problem</h2>
          <p className="text-gray-400">Fill in the details to create a new coding challenge</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Problem Basics */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-xl font-semibold text-white">
              <FileText size={22} className="text-blue-400" />
              <h3>Problem Details</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input 
                  {...register("title")} 
                  placeholder="Two Sum" 
                  className="input input-bordered w-full bg-[#1f2937] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500" 
                />
                {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea 
                  {...register("description")} 
                  placeholder="Given an array of integers nums and an integer target..."
                  rows={5}
                  className="textarea textarea-bordered w-full bg-[#1f2937] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                    <HardHat size={16} /> Difficulty
                  </label>
                  <div className="relative">
                    <select 
                      {...register("difficulty")} 
                      className="select select-bordered bg-[#1f2937] text-white w-full appearance-none"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                    <Tags size={16} /> Category
                  </label>
                  <div className="relative">
                    <select 
                      {...register("tags")} 
                      className="select select-bordered bg-[#1f2937] text-white w-full appearance-none"
                    >
                      <option value="array">Array</option>
                      <option value="linked-list">Linked List</option>
                      <option value="stack">Stack</option>
                      <option value="queue">Queue</option>
                      <option value="graph">Graph</option>
                      <option value="DP">Dynamic Programming</option>
                      <option value="recursion">Recursion</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 mt-2 flex items-center gap-2">
                  <Link2 size={16}/> Editorial 
                </label>
                <input 
                  {...register("editorial")} 
                  placeholder="video solution link {optional}" 
                  className="input input-bordered w-full bg-[#1f2937] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          </section>

          {/* Visible Test Cases */}
<section className="space-y-6">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3 text-xl font-semibold text-white">
      <Eye size={22} className="text-green-400" />
      <h3>Visible Test Cases</h3>
    </div>
    <button 
      type="button" 
      className="btn btn-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1"
      onClick={() => visibleFieldArray.append({ input: '', output: '', explanation: '' })}
    >
      <Plus size={16} /> Add Case
    </button>
  </div>
  
  <div className="space-y-4">
    {visibleFieldArray.fields.map((item, index) => (
      <div key={item.id} className="bg-[#1f2937]/50 p-4 rounded-lg border border-gray-800 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-300">Test Case #{index + 1}</span>
          <button
            type="button"
            onClick={() => visibleFieldArray.remove(index)}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Input</label>
            <textarea 
              {...register(`visibleTestCases.${index}.input`)} 
              placeholder="[2,7,11,15], 9" 
              rows={3}
              className="textarea textarea-bordered bg-[#1f2937] text-white w-full font-mono text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Output</label>
            <textarea 
              {...register(`visibleTestCases.${index}.output`)} 
              placeholder="[0,1]" 
              rows={3}
              className="textarea textarea-bordered bg-[#1f2937] text-white w-full font-mono text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Explanation</label>
            <textarea 
              {...register(`visibleTestCases.${index}.explanation`)} 
              placeholder="Because nums[0] + nums[1] == 9" 
              rows={3}
              className="textarea textarea-bordered bg-[#1f2937] text-white w-full" 
            />
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

{/* Hidden Test Cases */}
<section className="space-y-6">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3 text-xl font-semibold text-white">
      <EyeOff size={22} className="text-purple-400" />
      <h3>Hidden Test Cases</h3>
    </div>
    <button 
      type="button" 
      className="btn btn-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1"
      onClick={() => hiddenFieldArray.append({ input: '', output: '' })}
    >
      <Plus size={16} /> Add Case
    </button>
  </div>
  
  <div className="space-y-4">
    {hiddenFieldArray.fields.map((item, index) => (
      <div key={item.id} className="bg-[#1f2937]/50 p-4 rounded-lg border border-gray-800 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-300">Hidden Case #{index + 1}</span>
          <button
            type="button"
            onClick={() => hiddenFieldArray.remove(index)}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Input</label>
            <textarea 
              {...register(`Hiddencases.${index}.input`)} 
              placeholder="[3,2,4], 6" 
              rows={3}
              className="textarea textarea-bordered bg-[#1f2937] text-white w-full font-mono text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Output</label>
            <textarea 
              {...register(`Hiddencases.${index}.output`)} 
              placeholder="[1,2]" 
              rows={3}
              className="textarea textarea-bordered bg-[#1f2937] text-white w-full font-mono text-sm" 
            />
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

          {/* Starter Code */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xl font-semibold text-white">
                <Code size={22} className="text-yellow-400" />
                <h3>Starter Code</h3>
              </div>
              <button 
                type="button" 
                className="btn btn-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1"
                onClick={() => codeFieldArray.append({ language: 'javascript', initialCode: '' })}
              >
                <Plus size={16} /> Add Language
              </button>
            </div>
            
            <div className="space-y-4">
              {codeFieldArray.fields.map((item, index) => (
                <div key={item.id} className="bg-[#1f2937]/50 p-4 rounded-lg border border-gray-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">Language #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => codeFieldArray.remove(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Language</label>
                      <input 
                        {...register(`startCode.${index}.language`)} 
                        placeholder="javascript" 
                        className="input input-bordered bg-[#1f2937] text-white w-full" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Initial Code</label>
                      <textarea 
                        {...register(`startCode.${index}.initialCode`)} 
                        placeholder="function twoSum(nums, target) {\n  // Your code here\n}" 
                        rows={4}
                        className="textarea textarea-bordered bg-[#1f2937] text-white w-full font-mono text-sm" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reference Solution */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xl font-semibold text-white">
                <TestTube2 size={22} className="text-green-400" />
                <h3>Reference Solution</h3>
              </div>
              <button 
                type="button" 
                className="btn btn-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1"
                onClick={() => solutionFieldArray.append({ language: 'javascript', completeCode: '' })}
              >
                <Plus size={16} /> Add Solution
              </button>
            </div>
            
            <div className="space-y-4">
              {solutionFieldArray.fields.map((item, index) => (
                <div key={item.id} className="bg-[#1f2937]/50 p-4 rounded-lg border border-gray-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">Solution #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => solutionFieldArray.remove(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Language</label>
                      <input 
                        {...register(`referenceSolution.${index}.language`)} 
                        placeholder="javascript" 
                        className="input input-bordered bg-[#1f2937] text-white w-full" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Complete Code</label>
                      <textarea 
                        {...register(`referenceSolution.${index}.completeCode`)} 
                        placeholder="function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    // ...\n  }\n}" 
                        rows={6}
                        className="textarea textarea-bordered bg-[#1f2937] text-white w-full font-mono text-sm" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-4">
            <button 
              type="submit" 
              className="btn bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white w-full text-lg font-medium py-3 rounded-lg shadow-lg transition-all"
            >
              Create Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}